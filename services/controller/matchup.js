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

function getMatchup(channelId) {
  return channelMatchups[channelId] || null;
}

function setMatchup(channelId, matchup) {
  channelMatchups[channelId] = matchup;
  broadcastMatchup(channelId);
}

module.exports = {
  getMatchup,
  setMatchup,
};
