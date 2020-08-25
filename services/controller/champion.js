const {broadcast} = require('../util/pubsub');

const channelChampions = {};

function broadcastChampion(channelId) {
  const message = {
    type: 'updateChampion',
    message: channelChampions[channelId] ? channelChampions[channelId] : null,
  };

  broadcast(channelId, message);
}

function getChampion(channelId) {
  return channelChampions[channelId] || null;
}

function setChampion(channelId, champion) {
  channelChampions[channelId] = champion;
  broadcastChampion(channelId);
}

module.exports = {
  getChampion,
  setChampion,
};
