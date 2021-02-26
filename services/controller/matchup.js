const {broadcast} = require('../util/pubsub');
const {MatchupModel, SelectionMessageModel} = require('../models/matchup');

const channelMatchups = {};
const channelMessages = {};

const DEFAULT_MESSAGE = 'You\'re up! Connect to the match now!';

/**
 * @param {*} channelId the id of the channel who's matchup to broadcast.
 */
async function broadcastMatchup(channelId) {
  const message = {
    type: 'updateMatchup',
    message: await getMatchup(channelId),
  };

  broadcast(channelId, message);
}

/**
 * Gets the current matchup for the specified chanel.
 *
 * @param {*} channelId the channel who's matchup to get
 * @returns {object} The current matchup, null if none.
 */
async function getMatchup(channelId) {
  if (!(channelId in channelMatchups)) {
    channelMatchups[channelId] = new MatchupModel(channelId);
  }

  return await channelMatchups[channelId].getValue() || null;
}

/**
 * Sets the current matchup then broadcasts the change.
 *
 * @param {*} channelId the channel who's matchup to set.
 * @param {*} matchup the matchup to set.
 */
async function setMatchup(channelId, matchup) {
  if (!(channelId in channelMatchups)) {
    channelMatchups[channelId] = new MatchupModel(channelId);
  }

  await channelMatchups[channelId].setValue(matchup);

  broadcastMatchup(channelId);
}

/**
 * @param channelId
 * @param message
 */
async function setSelectionMessage(channelId, message) {
  if (!(channelId in channelMessages)) {
    channelMessages[channelId] = new SelectionMessageModel(channelId);
  }

  await channelMessages[channelId].setValue(message);
}

/**
 * @param channelId The channel whos selection message to update.
 */
async function getSelectionMessage(channelId) {
  if (!(channelId in channelMessages)) {
    channelMessages[channelId] = new SelectionMessageModel(channelId);
  }

  return (await channelMessages[channelId].getValue()) || DEFAULT_MESSAGE;
}

module.exports = {
  getMatchup,
  setMatchup,
  setSelectionMessage,
  getSelectionMessage,
};
