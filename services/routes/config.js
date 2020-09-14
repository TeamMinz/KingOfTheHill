const {isBroadcaster} = require('../util/middleware');

// eslint-disable-next-line new-cap
const config = require('express').Router();

/**
 * Sets the value for a specific key associated with this broadcaster.
 */
config.post('/set', isBroadcaster, (req, res) => {
  const {chanel_id: channelId} = req.twitch;

  console.log('setting key: ' + req.body.key);
  console.log('for channel: ' + channelId);
  console.log('to value: ' + req.body.value);

  res.sendStatus(200);
});

/**
 * Responds will all keys associated with the channel.
 */
config.get('/get', isBroadcaster, (req, res) => {
  const {channel_id: channelId} = req.twitch;

  console.log('fetching keys associated with:' + channelId);

  res.json({});
});

module.exports = config;
