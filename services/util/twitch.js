// const {buildClientAuth} = require('./auth');
const superagent = require('superagent');
const {CLIENT_ID} = require('./options');

/**
 * Resolves display name from a given user id.
 *
 * @param {*} userId the id of the users who's name to resolve.
 * @returns The display name of the specified person.
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

module.exports = {resolveDisplayName};
