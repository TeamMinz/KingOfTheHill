const {broadcast} = require('../util/pubsub');
const {ChampionModel} = require('../models/champion');
const { getLeaderboard } = require('./leaderboard');

/**
 * @type {Object.<string | number, ChampionModel>}
 */
const channelChampions = {};

/**
 * @typedef {object} Champion
 * @property {number} winStreak
 * @property {import('../controller/queue').Challenger} user 
 */

/**
 * @param {string | number} channelId
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
 * @param {string | number} channelId
 * @returns {Champion}
 */
async function getChampion(channelId) {
  if (!(channelId in channelChampions)) {
    channelChampions[channelId] = new ChampionModel(channelId);
  }

  return await channelChampions[channelId].getValue();
}

/**
 * @param {string | number} channelId
 * @param {Champion} champion
 */
async function setChampion(channelId, champion) {
  if (!(channelId in channelChampions)) {
    channelChampions[channelId] = new ChampionModel(channelId);
  }

  const currentChampion = await channelChampions[channelId].getValue();

  if (currentChampion && (!champion || champion.user.userId != currentChampion.user.userId)) {
    const leaderboard = getLeaderboard(channelId);

    console.log("Attempting leaderboard entry");
    console.log(currentChampion);
    console.log(await leaderboard.getWinThreshold());

    if (currentChampion.winStreak > await leaderboard.getWinThreshold()) {
      console.log("ASDF");
      await leaderboard.addEntry({
        score: currentChampion.winStreak,
        userId: currentChampion.user.userId,
        displayName: currentChampion.user.displayName
      });
    }
  }

  await channelChampions[channelId].setValue(champion);
  await broadcastChampion(channelId);
}

module.exports = {
  getChampion,
  setChampion,
};
