// eslint-disable-next-line new-cap
const matchup = require('express').Router();
const {broadcast} = require('../util/pubsub');

const channelMatchups = {};

function broadcastMatchup(channelId) {
  const message = {
    type: 'updateMatchup',
    message: channelMatchups[channelId]? channelMatchups[channelId] : null,
  };

  broadcast(channelId, message);
}

// Route for getting the current matchup
matchup.get('/current/get', (req, res) => {
  const {channel_id: channelId} = req.twitch;

  const matchup = channelMatchups[channelId]? channelMatchups[channelId] : null;

  res.json({matchup});
});

// Route for reporting the winner of the current mathcup
matchup.post('/current/report', (req, res) => {
  const {channel_id: channelId} = req.twitch;

  if (channelMatchups[channelId]) {
    // TODO: report winner somewhere.
    channelMatchups[channelId] = null;
    broadcastMatchup(channelId);
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
});

// Route for starting a new matchup.
matchup.post('/start', (req, res) => {
  const {channel_id: channelId} = req.twitch;
  let currentMatchup = channelMatchups[channelId];

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

    channelMatchups[channelId] = currentMatchup;
    broadcastMatchup(channelId);
    res.json({matchup: currentMatchup});
  }
});

module.exports = matchup;
