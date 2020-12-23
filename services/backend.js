const fs = require('fs');
const https = require('https');
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

app.listen(8081, () => {
  console.log('EBS now listening.');
});
