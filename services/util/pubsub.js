const jwt = require('jsonwebtoken');
const superagent = require('superagent');
const {OWNER_ID, CLIENT_ID, SECRET} = require('../backend');

const channelCooldowns = {};
const channelCooldownMs = 1000;
const serverTokenDurationSec = 30;

/**
 * @param {string} channelId the channel id
 * @returns {object} a signed authentication token.
 */
function buildChannelAuth(channelId) {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + serverTokenDurationSec,
    channel_id: channelId,
    user_id: OWNER_ID.toString(),
    role: 'external',
    pubsub_perms: {
      send: ['*'],
    },
  };

  return jwt.sign(payload, SECRET, {algorithm: 'HS256'});
}

/**
 * @param {*} channelId the channel to broadcast to
 * @param {object} message the message to broadcast
 */
function broadcastMessage(channelId, message) {
  const body = {
    content_type: 'application/json',
    message: JSON.stringify(message),
    targets: ['broadcast'],
  };

  superagent
      .post(`https://api.twitch.tv/extensions/message/${channelId}`)
      .set('Client-ID', CLIENT_ID)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + buildChannelAuth(channelId))
      .send(JSON.stringify(body))
      .then(function(response) {
        console.log('Successfully published broadcast for channel: ' + channelId);
      })
      .catch(function(err) {
        console.log('Error publishing broadcast for channel: ' + channelId);
        console.log(err.response.text);
      });
}
/**
 * Broadcasts pubsub message to specific user.
 *
 * @param {*} channelId channel to send the message in
 * @param {string} opaqueUserId user to send the message to
 * @param {object} message the message object to send
 */
// eslint-disable-next-line no-unused-vars
function broadcastUserSpecific(channelId, opaqueUserId, message) {
  const body = {
    content_type: 'application/json',
    message: JSON.stringify(message),
    targets: [`broadcast-${opaqueUserId}`],
  };

  superagent
      .post(`https://api.twitch.tv/extensions/message/${channelId}`)
      .set('Client-ID', CLIENT_ID)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + buildChannelAuth(channelId))
      .send(JSON.stringify(body))
      .then(function(response) {
        console.log('Successfully published broadcast for channel: ' + channelId);
      })
      .catch(function(err) {
        console.log('Error publishing broadcast for channel: ' + channelId);
        console.log(err.response.text);
      });
}

// if we get too many requests, we will stack broadcast requests
// this will cause us to be rate limited.
/**
 * Broadcast a message to the viewers in a specific channel
 *
 * @param {object} channelId the channel to send the broadcast in.
 * @param {object} message the message to broadcast.
 */
function scheduleBroadcast(channelId, message) {
  const now = Date.now();
  const cooldown = channelCooldowns[channelId];
  if (!cooldown || cooldown.time < now) {
    // It is.

    broadcastMessage(channelId, message);

    channelCooldowns[channelId] = {
      time: now + channelCooldownMs,
    };
  } else if (!cooldown.trigger) {
    // It isn't; schedule a delayed broadcast if we haven't already done so.
    cooldown.trigger = setTimeout(
        broadcastMessage,
        now - cooldown.time,
        channelId,
    );
  }
}

module.exports = {
  broadcast: scheduleBroadcast,
};
