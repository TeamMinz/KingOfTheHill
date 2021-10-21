const LeaderboardModel = require('../models/leaderboard');

/**
 * Controller class for Leaderboards.
 *
 * Handles all high level functions for leaderboards.
 *
 * @class
 * @public
 */
class Leaderboard {
  /**
   * Create a leaderboard for a particular channel.
   *
   * @param {string | number} channelId twitch channelId of the channel this represents.
   */
  constructor(channelId) {
    this._model = new LeaderboardModel(channelId);
    this._channelId = channelId;
  }

  /**
   * Gets the current state of the leaderboard.
   *
   * @returns {import('../models/leaderboard').LeaderboardEntry[]} array of each leaderboard entry, in order.
   */
  async getAsArray() {
    return await this._model.getValue();
  }

  /**
   * Gets the record you need to beat to make it onto the leaderboard.
   *
   * @returns {number} number of wins to beat, in order to get on the leaderboard.
   */
  async getWinThreshold() {
    const maxSize = await this._model.getMaxSize();
    const leaderboard = await this._model.getValue();

    if (leaderboard.length < maxSize) return 0;
    return leaderboard[maxSize - 1].score;
  }

  /**
   * Empties the leaderboard.
   */
  async clearLeaderboard() {
    await this._model.setValue([]);
  }

  /**
   * Adds an entry to the leaderboard, if it meets the threshold.
   *
   * @param {import('../models/leaderboard').LeaderboardEntry} entry entry to add to the leaderboard
   * @returns {boolean} whether the entry was added to the leaderboard or not.
   */
  async addEntry(entry) {
    const winThreshold = await this.getWinThreshold();
    const maxSize = await this._model.getMaxSize();
    if (entry.score > winThreshold) {
      let leaderboard = await this._model.getValue();

      leaderboard.push(entry);
      leaderboard.sort((a, b) => b.score - a.score); // Sort descending by score
      await this._model.setValue(leaderboard.slice(0, maxSize));
    }
  }
}

const channelLeaderboards = {}; // Cache of channel leaderboard controllers.

/**
 *  Gets a specified leaderboard.
 *
 * @param {string | number} channelId twitch channelId of the channel to fetch from.
 * @returns {Leaderboard} the leaderboard of specified channel.
 */
function getLeaderboard(channelId) {
  if (!(channelId in channelLeaderboards)) {
    channelLeaderboards[channelId] = new Leaderboard(channelId);
  }

  return channelLeaderboards[channelId];
}

module.exports = {getLeaderboard};