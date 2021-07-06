const leaderboard = require('express').Router();
const {StatusCodes} = require('http-status-codes');
const {isBroadcaster} = require('../util/middleware');

const {getLeaderboard} = require('../controller/leaderboard');

leaderboard.get('/', async (req, res) => {
  const {channel_id: channelId} = req.twitch;

  const board = getLeaderboard(channelId);

  res.json(await board.getAsArray());
});

leaderboard.delete('/', isBroadcaster, async (req, res) => {
  const {channel_id: channelId} = req.twitch;

  const board = getLeaderboard(channelId);

  await board.clear();

  res.sendStatus(StatusCodes.OK);
});

module.exports = leaderboard;
