const leaderboard = require('express').Router();

const {getLeaderboard} = require('../controller/leaderboard');

leaderboard.get('/', async (req, res) => {
  const {channel_id: channelId} = req.twitch;

  const board = getLeaderboard(channelId);

  res.json(await board.getAsArray());
});

module.exports = leaderboard;
