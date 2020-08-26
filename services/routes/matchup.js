// eslint-disable-next-line new-cap
const express = require('express');
// eslint-disable-next-line new-cap
const matchup = express.Router();
const {getQueue} = require('../controller/queue');
const {getChampion, setChampion} = require('../controller/champion');
const {getMatchup, setMatchup} = require('../controller/matchup');

const DEFAULT_MESSAGE = 'You\'re up! Connect to the match now!';

const channelMessages = {};

/**
 * Reports the winner of a matchup.
 *
 * @param channelId The channel to report the winner for.
 * @param winner the user object of the winner of the matchup.
 */
function reportWinner(channelId, winner) {
  // Record this win.
  const champ = getChampion(channelId);
  if (champ && champ.user.opaqueUserId == winner.opaqueUserId) {
    champ.winStreak++;
    setChampion(channelId, champ);
  } else {
    setChampion(channelId, {
      winStreak: 1,
      user: winner,
    });
  }
  // Put the winner back in as #0 in the queue.
  const queue = getQueue(channelId);
  queue.insert(0, winner);
}

/**
 * Rejects requests from people not the broadcaster.
 *
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
 * Express middleware that rejects people not
 * authoized to get a channels you're up message
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
    if (!getMatchup(channelId)) {
      res.sendStatus(401);
      return;
    }

    const {challenger, champion} = getMatchup(channelId);

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

matchup.get('/message/get', canGetMessage, (req, res) => {
  const {channel_id: channelId} = req.twitch;

  res.json({message: channelMessages[channelId] || DEFAULT_MESSAGE});
});

matchup.post('/message/set', isBroadcaster, (req, res) => {
  const {channel_id: channelId} = req.twitch;
  const {message} = req.body;
  channelMessages[channelId] = message;
  res.json({message});
});

// Route for getting the current matchup
matchup.get('/current/get', (req, res) => {
  const {channel_id: channelId} = req.twitch;

  res.json({matchup: getMatchup(channelId)});
});

// Route for reporting the winner of the current mathcup
matchup.post('/current/report', isBroadcaster, (req, res) => {
  const {channel_id: channelId} = req.twitch;

  if (getMatchup(channelId)) {
    const previousMatchup = getMatchup(channelId);
    // Set the winner of the matchup as the new champion.
    if (req.body.winner == 'challenger') {
      reportWinner(channelId, previousMatchup.challenger);
    } else if (req.body.winner == 'champion') {
      reportWinner(channelId, previousMatchup.champion);
    }
    // reset the matchup.
    setMatchup(channelId, null);
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
});

// Route for starting a new matchup.
matchup.post('/start', isBroadcaster, (req, res) => {
  const {channel_id: channelId} = req.twitch;
  const currentMatchup = getMatchup(channelId);

  // Lets do some checks to make sure we're not doing anything bad.
  if (currentMatchup) {
    res
        .status(500)
        .send({error: true, message: 'There is already a match in progress'});
    return;
  }

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

  console.log(getChampion(channelId));
  if (!getChampion(channelId)) {
    setChampion(channelId, {
      winStreak: 0,
      user: champion,
    });
  }

  console.log(
      // eslint-disable-next-line max-len
      `Starting match between ${matchup.champion} and ${matchup.challenger}`,
  );

  setMatchup(channelId, matchup);
  res.json({matchup});
});

module.exports = matchup;
