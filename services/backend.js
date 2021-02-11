const fs = require('fs');
const http = require('http');
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const config = require('./config.json');

const {authorizeHeader} = require('./util/middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(authorizeHeader);

app.use('/', routes);

//Route for testing connectivity.
app.get('/ping', (req, res) => {
    res.send('pong');
});

const HOST = '0.0.0.0';
const PORT = 8000;

app.listen(PORT, HOST);
