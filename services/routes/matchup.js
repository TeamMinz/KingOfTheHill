const express = require('express');
const router = new express.Router();

module.exports = (ownerId, secret, clientId) => {
  // Route for getting the current matchup
  router.get('/current/get', (req, res) => {});

  // Route for reporting the winner of the current mathcup
  router.post('/current/report', (req, res) => {});

  // Route for starting a new matchup.
  router.post('/start', (req, res) => {});

  return router;
};
