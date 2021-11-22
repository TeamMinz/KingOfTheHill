const superagent = require('superagent');
const jwt = require('jsonwebtoken');
const {OWNER_ID, SECRET, CLIENT_ID, CLIENT_SECRET} = require('./options');
const {getCachedValue, setCachedValue} = require('./cache');

const serverTokenDurationSec = 30;

/**
 * Builds an authenticaion payload, that authenticates
 * requests to twitch's pubsub & configuration apis.
 *
 * @param {string} channelId the id of the broadcaster.
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
 * Builds an authenticaion payload, that authenticates
 * requests to twitch's pubsub & configuration apis.
 *
 * @returns {null | string} an App Access Token. null if authentication fails.
 */
const buildExtensionAuth = async () => {
  const keyExpiry = await getCachedValue('access_token_expiry');

  if (keyExpiry && new Date(keyExpiry) > Date.now()) {
    return await getCachedValue('access_token');
  }

  try {
    const resp = await superagent
        .post('https://id.twitch.tv/oauth2/token')
        .query({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: 'client_credentials',
        });

    if (!resp.ok) return null;

    const {access_token: accessToken, expires_in: expiresIn} = resp.body;

    const accessExpiry = Date.now().valueOf() + expiresIn;

    await setCachedValue('access_token_expiry', accessExpiry);
    await setCachedValue('access_token', accessToken);

    return accessToken;
  } catch (e) {
    return null;
  }
};

/**
 * Resolves display name from a given user id.
 *
 * @param {string} userId the id of the users who's name to resolve.
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
 * Resolves a channelId into the streamers name.
 *
 * @param {string | number} channelId the channeid to resolve into a name.
 * @returns {null | string} Null if the resolution fails, otherwise the name.
 */
async function resolveChannelName(channelId) {
  try {
    const resp = await superagent
        .get(`https://api.twitch.tv/kraken/channels/${channelId}`)
        .set('Client-ID', CLIENT_ID)
        .set('Accept', 'application/vnd.twitchtv.v5+json');

    if (resp.ok) {
      return resp.body.display_name;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
}
/**
 * Gets the configuration settings for the channelId.
 *
 * @param {*} channelId the channel to broadcast to
 * @returns {any} configuration settings.
 */
const getBroadcasterConfig = async (channelId) => {
  try {
    const resp = await superagent
        .get(`https://api.twitch.tv/extensions/${CLIENT_ID}/configurations/segments/broadcaster`)
        .query({channel_id: channelId})
        .set('client-id', CLIENT_ID)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + buildChannelAuth(channelId));
    if (resp.ok) {
      const content = JSON.parse(resp.body[`broadcaster:${channelId}`].record.content);
      const version = resp.body[`broadcaster:${channelId}`].record.verison;
      return {version, content};
    } else {
      return {};
    }
  } catch (e) {
    console.error(e);
    return {};
  }
};

/**
 * Gets all of the channels currently live with our extension.
 *
 * @returns {any} a list of channel ids
 */
const getLiveChannels = async () => {
  try {
    const resp = await superagent
        .get(`https://api.twitch.tv/helix/extensions/live`)
        .query({extension_id: CLIENT_ID})
        .set('Client-Id', CLIENT_ID)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + (await buildExtensionAuth()));
    if (resp.ok) {
      const content = resp.body.data.map((x) => x.broadcaster_id);
      return content;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};

module.exports = {
  buildChannelAuth,
  buildExtensionAuth,
  resolveDisplayName,
  getBroadcasterConfig,
  resolveChannelName,
  getLiveChannels,
};
