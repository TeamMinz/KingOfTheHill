const leaderboard = require('express').Router();

leaderboard.get('/', (req, res) => {
  // console.log('asdf');
  res.status(200).send('Hello World!');
});

module.exports = leaderboard;
