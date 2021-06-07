const express = require('express');
const matchup = express.Router();
const {StatusCodes} = require('http-status-codes');
const {getQueue} = require('../controller/queue');
const {getChampion, setChampion} = require('../controller/champion');
const {getMatchup, setMatchup, setSelectionMessage, getSelectionMessage} = require('../controller/matchup');
const {isBroadcaster, isQueueOpen} = require('../util/middleware');
const twitch = require('../util/twitch');


/**
 * Reports the winner of a matchup.
 *
 * @param {string} channelId The channel to report the winner for.
 * @param {object} winner the user object of the winner of the matchup.
 * @param {object} loser the user object of the loser of the matchup.
 * @param {boolean} broadcasterLost If the broadcaster lost
 */
const reportWinner = async (channelId, winner, loser, broadcasterLost) => {
  // Record this win.
  const champ = await getChampion(channelId);
  if (champ && champ.user.opaqueUserId == winner.opaqueUserId) {
    champ.winStreak++;
    await setChampion(channelId, champ);
  } else {
    await setChampion(channelId, {
      winStreak: 1,
      user: winner,
    });
  }

  const queue = getQueue(channelId);

  // If broadcaster lost set them back to their desired position
  if (broadcasterLost) {
    const {version, content} = await twitch.getBroadcasterConfig(channelId);

    // Legacy support, can be removed after front end 1.0.0 is released.
    if (version == '0.2') {
      if (content.rejoin) {
        if (content.position != '') {
          await queue.insert(content.position - 1, loser);
        } else {
          await queue.enqueue(loser);
        }
      }
    } else if (version == '1.0.0') {
      if (content.rejoinSettings) {
        if (content.rejoinSettings.rejoin) {
          if (content.rejoinSettings.position) {
            await queue.insert(content.rejoinSettings.position - 1, loser);
          } else {
            await queue.enqueue(loser);
          }
        }
      }
    }
  }

  // Put the winner back in as #0 in the queue.
  await queue.insert(0, winner);
};

/**
 * Express middleware that rejects people not
 * authoized to get a channels you're up message
 *
 * @param {express.Request} req request object
 * @param {express.Response} res response object
 * @param {Function} next next handler
 */
async function canGetMessage(req, res, next) {
  const {channel_id: channelId, opaque_user_id: opaqueUserId} = req.twitch;

  if (req.twitch.role == 'broadcaster') {
    next();
  } else {
    if (!await getMatchup(channelId)) {
      res.sendStatus(StatusCodes.OK);
      return;
    }

    const {challenger, champion} = await getMatchup(channelId);

    if (
      challenger.opaqueUserId == opaqueUserId ||
      champion.opaqueUserId == opaqueUserId
    ) {
      next();
    } else {
      res.sendStatus(StatusCodes.UNAUTHORIZED);
    }
  }
}

matchup.get('/message/get', canGetMessage, async (req, res) => {
  const {channel_id: channelId} = req.twitch;

  res.json({message: await getSelectionMessage(channelId)});
});

matchup.post('/message/set', isBroadcaster, async (req, res) => {
  const {channel_id: channelId} = req.twitch;
  const {message} = req.body;
  await setSelectionMessage(channelId, message);
  res.json({message});
});

// Route for getting the current matchup
matchup.get('/current/get', async (req, res) => {
  const {channel_id: channelId} = req.twitch;

  res.json({matchup: await getMatchup(channelId)});
});

// Route for reporting the winner of the current mathcup
matchup.post('/current/report',
    isBroadcaster,
    isQueueOpen,
    async (req, res) => {
      const {channel_id: channelId, opaque_user_id: opaqueUserId} = req.twitch;

      // Error out if we don't have the required parameters.
      if (!req.body.winner) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
      }

      const previousMatchup = await getMatchup(channelId);

      if (previousMatchup) {
        // Set the winner of the matchup as the new champion.
        if (req.body.winner == 'challenger') {
          const broadcasterLost =
        opaqueUserId === previousMatchup.champion.opaqueUserId;
          await reportWinner(
              channelId,
              previousMatchup.challenger,
              previousMatchup.champion,
              broadcasterLost,
          );
        } else if (req.body.winner == 'champion') {
          const broadcasterLost =
        opaqueUserId === previousMatchup.challenger.opaqueUserId;
          await reportWinner(
              channelId,
              previousMatchup.champion,
              previousMatchup.challenger,
              broadcasterLost,
          );
        }
        // reset the matchup.
        await setMatchup(channelId, null);
        res.sendStatus(StatusCodes.OK);
      } else {
        res.sendStatus(StatusCodes.BAD_REQUEST);
      }
    });

// Route for reporting a forfeit
matchup.post('/current/forfeit',
    isBroadcaster,
    isQueueOpen,
    async (req, res) => {
      const {channel_id: channelId} = req.twitch;
      const matchup = await getMatchup(channelId);

      // Error out if we don't have the required parameters.
      if (!req.body.player) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
      }

      if (matchup) {
        const queue = getQueue(channelId);

        if (req.body.player == 'challenger') { // Forfeit the challenger.
          await queue.insert(0, matchup.champion);
        } else {
          await queue.insert(0, matchup.challenger);
          await setChampion(channelId, null);
        }
        // reset the matchup
        await setMatchup(channelId, null);
        res.sendStatus(StatusCodes.OK);
      } else {
        res.sendStatus(StatusCodes.BAD_REQUEST);
      }
    });

// Route for starting a new matchup.
matchup.post('/start', isBroadcaster, isQueueOpen, async (req, res) => {
  const {channel_id: channelId} = req.twitch;
  const currentMatchup = await getMatchup(channelId);

  // Lets do some checks to make sure we're not doing anything bad.
  if (currentMatchup) {
    res
        .status(StatusCodes.BAD_REQUEST)
        .send({error: true, message: 'There is already a match in progress'});
    return;
  }

  const queue = getQueue(channelId);

  if ((await queue.getSize()) < 2) {
    res.status(StatusCodes.BAD_REQUEST).send({
      error: true,
      message: 'There are not enough people in the queue',
    });
    return;
  }

  // Ok... lets actually start the match now.

  const champion = await queue.dequeue();
  const challenger = await queue.dequeue();

  const matchup = {
    champion,
    challenger,
  };

  if (!(await getChampion(channelId))) {
    await setChampion(channelId, {
      winStreak: 0,
      user: champion,
    });
  }

  console.log(
      // eslint-disable-next-line max-len
      `Starting match between ${JSON.stringify(matchup.champion)} and ${JSON.stringify(matchup.challenger)}`,
  );

  await setMatchup(channelId, matchup);
  res.json({matchup});
});

module.exports = matchup;
