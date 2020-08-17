const matchup = require('express').Router;

let currentMatchup = null;

// Route for getting the current matchup
matchup.get('/current/get', (req, res) => {
  res.json({matchup: currentMatchup});
});

// Route for reporting the winner of the current mathcup
matchup.post('/current/report', (req, res) => {
  if (currentMatchup) {
    console.log(req.body);
    currentMatchup = null;
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
});

// Route for starting a new matchup.
matchup.post('/start', (req, res) => {
  if (currentMatchup) {
    res
        .status(500)
        .json({error: true, message: 'There is already a match in progress'});
  } else {
    currentMatchup = {champion: 'tminz', challenger: 'pycses'};
    console.log(
        // eslint-disable-next-line max-len
        `Starting match between ${currentMatchup.champion} and ${currentMatchup.challenger}`,
    );
    res.json({matchup: currentMatchup});
  }
});

module.exports = {
  matchup,
};
