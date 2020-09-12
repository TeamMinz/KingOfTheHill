const fs = require('fs');
const https = require('https');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const routes = require('./routes');
const config = require('./config.json');
const {SECRET} = require('./util/options');

process.env.NODE_ENV = config.mode;
if (process.env.NODE_ENV == 'development') {
  // We will be using self signed certs in development.
  // We need to make sure that we specifically allow that.
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

// Load our TLS cert and key.

const TLS_CERT_PATH = config.tls.certPath;
const TLS_KEY_PATH = config.tls.keyPath;
const TLS_CA_PATH = config.tls.caPath;

const TLS = {
  cert: fs.readFileSync(TLS_CERT_PATH),
  key: fs.readFileSync(TLS_KEY_PATH),
};

if (process.env.NODE_ENV != 'development') {
  TLS.ca = fs.readFileSync(TLS_CA_PATH);
}

// Create some middleware to help authorize the requests.

/**
 * @param {express.Request} req the request object passed from express.
 * @param {express.Response} res the response object passed by express.
 * @param {Function} next the next middleware function in the order.
 */
function authorizeHeader(req, res, next) {
  if (!req.headers.authorization) {
    // TODO sent appropriate response code.
    return;
  }

  const authstr = req.headers.authorization;
  const bearerPrefix = 'Bearer ';

  if (authstr.startsWith(bearerPrefix)) {
    const token = authstr.substring(bearerPrefix.length);

    jwt.verify(token, SECRET, function(err, payload) {
      if (err) {
        console.log(err);
        res.status(401).send('Failed to authorize JWT token.');
        return;
      }

      req.twitch = payload;

      next();
    });
  } else {
    res.status(401).send('Failed to authorize JWT token.');
    return;
  }
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(authorizeHeader);

app.use('/', routes);

https.createServer(TLS, app).listen(8081, () => {
  console.log('EBS now listening.');
});
