const leaderboard = require('express').Router();
const {StatusCodes} = require('http-status-codes');
const {isBroadcaster} = require('../util/middleware');

const {getLeaderboard} = require('../controller/leaderboard');

leaderboard.get('/', async (req, res) => {
  const {channel_id: channelId} = req.twitch;
  const leaderboard = await getLeaderboard(channelId);
  res.json(await leaderboard.getAsArray());
});

leaderboard.delete('/', isBroadcaster, async (req, res) => {
  const {channel_id: channelId} = req.twitch;

  const board = getLeaderboard(channelId);

  await board.clearLeaderboard();

  res.sendStatus(StatusCodes.OK);
});

leaderboard.get('/size', isBroadcaster, async (req, res) => {
  const {channel_id: channelId} = req.twitch;
  const leaderboard = await getLeaderboard(channelId);

  const maxSize = await leaderboard.getMaxSize();
  res.status(StatusCodes.OK).send({size: maxSize});
});

leaderboard.put('/size', isBroadcaster, async (req, res) => {
  const {channel_id: channelId} = req.twitch;
  const leaderboard = await getLeaderboard(channelId);
  let size;
  try {
    size = parseInt(req.body.size, 10);
    await leaderboard.setMaxSize(size);
  } catch (e) {
    // TODO: logging
    return res.status(StatusCodes.BAD_REQUEST);
  }
});

module.exports = leaderboard;
