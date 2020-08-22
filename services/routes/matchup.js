// eslint-disable-next-line new-cap
const express = require('express');
// eslint-disable-next-line new-cap
const matchup = express.Router();
const {broadcast} = require('../util/pubsub');
const {getQueue} = require('../controller/queue');

const DEFAULT_MESSAGE = 'You\'re up! Connect to the match now!';

const channelMatchups = {};
const channelMessages = {};

/**
 * @param {express.Request} req request object
 * @param {express.Response} res response object
 * @param {Function} next next handler
 */
function isBroadcaster(req, res, next) {
  if (req.twitch.role == 'broadcaster') {
    next();
  } else {
    res.sendStatus(401);
  }
}

/**
 * 
 * 
 * @param {express.Request} req request object
 * @param {express.Response} res response object
 * @param {Function} next next handler
 */
function canGetMessage(req, res, next) {
  const {channel_id: channelId, opaque_user_id: opaqueUserId} = req.twitch;

  if (req.twitch.role == 'broadcaster') {
    next();
  } else {
    const {challenger, champion} = channelMatchups[channelId];

    if (
      challenger.opaqueUserId == opaqueUserId ||
      champion.opaqueUserId == opaqueUserId
    ) {
      next();
    } else {
      res.sendStatus(401);
    }
  }
}

/**
 * @param channelId the id of the channel who's matchup to broadcast.
 */
function broadcastMatchup(channelId) {
  const message = {
    type: 'updateMatchup',
    message: channelMatchups[channelId] ? channelMatchups[channelId] : null,
  };

  broadcast(channelId, message);
}

matchup.get('/message/get', canGetMessage, (req, res) => {
  const {channel_id: channelId} = req.twitch;

  res.json({message: channelMessages[channelId] || DEFAULT_MESSAGE});
});

matchup.post('/message/set', isBroadcaster, (req, res) => {
  const {channel_id: channelId} = req.twitch;
  const {message} = req.body;
  console.log(req.body);
  channelMessages[channelId] = message;
  res.json({message});
});

// Route for getting the current matchup
matchup.get('/current/get', (req, res) => {
  const {channel_id: channelId} = req.twitch;

  const matchup = channelMatchups[channelId] ?
    channelMatchups[channelId] :
    null;

  res.json({matchup});
});

// Route for reporting the winner of the current mathcup
matchup.post('/current/report', isBroadcaster, (req, res) => {
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
matchup.post('/start', isBroadcaster, (req, res) => {
  const {channel_id: channelId} = req.twitch;
  const currentMatchup = channelMatchups[channelId];

  // Lets do some checks to make sure we're not doing anything bad.
  if (currentMatchup) {
    res
        .status(500)
        .send({error: true, message: 'There is already a match in progress'});
    return;
  }
  // currentMatchup = {champion: 'tminz', challenger: 'pycses'};
  const queue = getQueue(channelId);

  if (queue.getSize() < 2) {
    res.status(500).send({
      error: true,
      message: 'There are not enough people in the queue',
    });
    return;
  }

  // Ok... lets actually start the match now.

  const champion = queue.dequeue();
  const challenger = queue.dequeue();

  const matchup = {
    champion,
    challenger,
  };

  console.log(
      // eslint-disable-next-line max-len
      `Starting match between ${matchup.champion} and ${matchup.challenger}`,
  );

  channelMatchups[channelId] = matchup;
  broadcastMatchup(channelId);
  res.json({matchup});
});

module.exports = matchup;
