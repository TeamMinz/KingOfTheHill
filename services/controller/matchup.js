const {broadcast} = require('../util/pubsub');

const channelMatchups = {};

/**
 * @param {*} channelId the id of the channel who's matchup to broadcast.
 */
function broadcastMatchup(channelId) {
  const message = {
    type: 'updateMatchup',
    message: getMatchup(channelId),
  };

  broadcast(channelId, message);
}

/**
 * Gets the current matchup for the specified chanel.
 *
 * @param {*} channelId the channel who's matchup to get
 * @returns {object} The current matchup, null if none.
 */
function getMatchup(channelId) {
  return channelMatchups[channelId] || null;
}

/**
 * Sets the current matchup then broadcasts the change.
 *
 * @param {*} channelId the channel who's matchup to set.
 * @param {*} matchup the matchup to set.
 */
function setMatchup(channelId, matchup) {
  channelMatchups[channelId] = matchup;
  broadcastMatchup(channelId);
}

module.exports = {
  getMatchup,
  setMatchup,
};
