// const {buildClientAuth} = require('./auth');
const superagent = require('superagent');
const jwt = require('jsonwebtoken');
const {OWNER_ID, SECRET, CLIENT_ID} = require('./options');

// const messageQueues = {};
// const channelCooldowns = {};
// const channelCooldownMs = 1000;
const serverTokenDurationSec = 30;

/**
 * @param {string} channelId the channel id
 * @returns {object} a signed authentication token.
 */
const buildChannelAuth = (channelId) => {
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
};

/**
 * Resolves display name from a given user id.
 *
 * @param {*} userId the id of the users who's name to resolve.
 * @returns {string} The display name of the specified person.
 */
async function resolveDisplayName(userId) {
  try {
    const resp = await superagent
        .get(`https://api.twitch.tv/kraken/users/${userId}`)
        .set('Client-ID', CLIENT_ID)
        .set('Accept', 'application/vnd.twitchtv.v5+json');
    if (resp.ok) {
      return resp.body.display_name;
    } else {
      return 'anonymous';
    }
  } catch (e) {
    return 'anonymous';
  }
}

/**
 * @param {*} channelId the channel to broadcast to
 * 
 */
const getbroadcasterConfig = async (channelId) => {
  try {
    const resp = await superagent
        .get(
            `https://api.twitch.tv/extensions/${CLIENT_ID}/configurations/segments/broadcaster`,
        )
        .query({channel_id: channelId})
        .set('client-id', CLIENT_ID)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + buildChannelAuth(channelId));
    if (resp.ok) {
      console.log(resp);
      console.log(resp.body);
      return resp.body.broadcaster.rejoin;
    } else {
      console.log(resp.body);
      return 'anonymous';
    }
  } catch (e) {
    console.log(e);
    return 'anonymous';
  }
};

module.exports = {buildChannelAuth, resolveDisplayName, getbroadcasterConfig};
