// eslint-disable-next-line new-cap
const champion = require('express').Router();
// const {broadcast} = require('../util/pubsub');

const {getChampion} = require('../controller/champion');

champion.get('/get', (req, res) => {
  const {channel_id: channelId} = req.twitch;
  const champ = getChampion(channelId);
  res.json(champ);
});

module.exports = champion;
