const superagent = require('superagent');
const jwt = require('jsonwebtoken');
const {OWNER_ID, SECRET, CLIENT_ID, CLIENT_SECRET} = require('./options');
const {getCacheValue, setCacheValue} = require('./cache');

const serverTokenDurationSec = 30;

/**
 * Makes an API request to a twitch helix endpoint.
 *
 * @param {string} endpoint The endpoint to query.
 * @returns {Promise<any>} The response from the twitch api.
 */
const _api = (endpoint) => {
  return superagent.get(`https://api.twitch.tv/helix/${endpoint}`)
      .set('Client-ID', CLIENT_ID)
      .set('Accept', 'application/vnd.twitchtv.v5+json');
};

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
  const keyExpiry = await getCacheValue('access_token_expiry');

  if (keyExpiry && new Date(keyExpiry) > Date.now()) {
    return await getCacheValue('access_token');
  }

  try {
    const resp = await superagent.post('https://id.twitch.tv/oauth2/token').query({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials',
    });

    if (!resp.ok) return null;

    const {access_token: accessToken, expires_in: expiresIn} = resp.body;

    const accessExpiry = Date.now().valueOf() + expiresIn;

    await setCacheValue('access_token_expiry', accessExpiry);
    await setCacheValue('access_token', accessToken);

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
    const {data} = await _api('users')
        .query({id: userId});
    return data.display_name;
  } catch (e) {
    return 'anonymous';
  }
}

/**
 * Resolves a channelId into the streamers name.
 *
 * @param {string | number} channelId The twitch user_id of the broadcaster. 
 * @returns {null | string} Null if the resolution fails, otherwise the name.
 */
async function resolveChannelName(channelId) {
  try {
    const {broadcaster_name: name} = await _api(`channels/${channelId}`);
    return name;
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
        .get('https://api.twitch.tv/helix/extensions/configurations')
        .query({broadcaster_id: channelId, extension_id: CLIENT_ID, segment: 'broadcaster'})
        .set('client-id', CLIENT_ID)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${buildChannelAuth(channelId)}`);
    if (resp.ok) {
      const body = resp.body.data;
      if (body.length == 0) {
        return {version: null, content: {}};
      }
      const {version, content} = body[0];
      return {version, content: JSON.parse(content)};
    } else {
      return {version: null, content: {}};
    }
  } catch (e) {
    console.error(e);
    return {version: null, content: {}};
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
