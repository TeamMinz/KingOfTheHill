const {broadcast} = require('../util/pubsub');
const {ChampionModel} = require('../models/champion');

const channelChampions = {};

/**
 * @param channelId
 */
async function broadcastChampion(channelId) {
  const champion = await channelChampions[channelId].getValue();

  const message = {
    type: 'updateChampion',
    message: champion,
  };

  broadcast(channelId, message);
}

/**
 * @param channelId
 */
async function getChampion(channelId) {
  if (!(channelId in channelChampions)) {
    channelChampions[channelId] = new ChampionModel(channelId);
  }

  return await channelChampions[channelId].getValue();
}

/**
 * @param channelId
 * @param champion
 */
async function setChampion(channelId, champion) {
  if (!(channelId in channelChampions)) {
    channelChampions[channelId] = new ChampionModel(channelId);
  }
  await channelChampions[channelId].setValue(champion);
  await broadcastChampion(channelId);
}

module.exports = {
  getChampion,
  setChampion,
};
