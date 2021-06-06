const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const {authorizeHeader} = require('./util/middleware');

const app = express();

// unprotected route for testing connectivity.
app.get('/ping', (req, res) => {
  res.send('pong');
});

app.use(cors());
app.use(express.json());
app.use(authorizeHeader); // JWT validation

app.use('/', routes);
const HOST = '0.0.0.0';
const PORT = 8000;

app.listen(PORT, HOST, () => {
  console.log(`Listening on ${HOST}:${PORT}`);
});
