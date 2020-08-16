const express = require('express');
const router = new express.Router();

module.exports = (ownerId, secret, clientId) => {
  let currentMatchup = null;

  // Route for getting the current matchup
  router.get('/current/get', (req, res) => {
    res.json({matchup: currentMatchup});
  });

  // Route for reporting the winner of the current mathcup
  router.post('/current/report', (req, res) => {
    if (currentMatchup) {
      console.log(req.body);
      currentMatchup = null;
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  });

  // Route for starting a new matchup.
  router.post('/start', (req, res) => {
    if (currentMatchup) {
      res
          .status(500)
          .json({error: true, message: 'There is already a match in progress'});
    } else {
      currentMatchup = {playerOne: 'tminz', playerTwo: 'pycses'};
      console.log(
          // eslint-disable-next-line max-len
          `Starting match between ${currentMatchup.playerOne} and ${currentMatchup.playerTwo}`,
      );
      res.json({matchup: currentMatchup});
    }
  });

  return router;
};
