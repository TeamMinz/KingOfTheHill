require('dotenv').config();
const fs = require('fs');
const https = require('https');
const express = require('express');
const yargs = require('yargs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const routes = require('./routes');

if (process.env.NODE_ENV == 'development') {
  // We will be using self signed certs in development.
  // We need to make sure that we specifically allow that.
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

// Process command line arguments
const argv = yargs
    .describe('ownerid', 'The extension\'s owner id')
    .alias('o', 'ownerid')
    .describe('secret', 'The extension\'s secret')
    .alias('s', 'secret')
    .describe('clientid', 'The extension\'s clientId')
    .alias('c', 'clientid').argv;

// Fetch some environment variables that we will need.

/**
 * @param {string} option
 *  The name of the option to get from the command line args.
 * @param {string} envOption
 *  The environment variable to fetch if there is no cli flag.
 * @returns {object} The specified option / environment variable if it exists.
 */
function getOption(option, envOption) {
  if (argv[option]) {
    return argv[option];
  } else if (process.env[envOption]) {
    return process.env[envOption];
  }
  // Panic
  throw new Error(`Missing required "${option}" environment variable.`);
}

const OWNER_ID = getOption('ownerid', 'EXT_OWNER_ID');
const SECRET = Buffer.from(getOption('secret', 'EXT_SECRET'), 'base64');
const CLIENT_ID = getOption('clientid', 'EXT_CLIENT_ID');

// Load our TLS cert and key.

const TLS_CERT_PATH = '../conf/.crt';
const TLS_KEY_PATH = '../conf/.key';

const TLS = {
  key: fs.readFileSync(TLS_KEY_PATH),
  cert: fs.readFileSync(TLS_CERT_PATH),
};

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

module.exports = {
  OWNER_ID,
  CLIENT_ID,
  SECRET,
};

