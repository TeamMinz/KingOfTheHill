const {getRedis} = require('../util/database');

const redis = getRedis();

const production = process.env.NODE_ENV == 'production';

/**
 * @typedef {object} LeaderboardEntry
 * @property {number} score The score of this leaderboard entry
 * @property {string} userId The userid of the person who set this record.
 * @property {string} displayName The display name of the person who set this record, at that time.
 */

/**
 * Model for the current state of the leaderboard.
 *
 */
class LeaderboardModel {
  /**
   * @param channelId The id of the channel who's leaderboard this model represents.
   */
  constructor(channelId) {
    this._channeldId = channelId;
    this._debugValue = {};
    this._key = `${this.channelId}_leaderboard`;
    this._maxSizeKey = `${this.channelId}_leaderboard_max_size`;
  }

  /**
   * @returns {LeaderboardEntry[]} The current state of the leaderboard
   */
  async getValue() {
    if (production) {
      return;
    } else {
      if (!(this._key in this._debugValue)) return [];
      return this._debugValue[this._key];
    }
  }

  /**
   * @returns {number} The maximum number of entries on the leaderboard. Default 10
   */
  async getMaxSize() {
    if (production) {
      return;
    } else {
      if (!(this._maxSizeKey in this._debugValue)) return 10;
      return this._debugValue[this._maxSizeKey];
    }
  }

  /**
   * Sets the max number of entries on the leaderboard.
   *
   * @param {number} maxSize The max size of the leaderboard. Cannot be higher than 100.
   */
  async setMaxSize(maxSize) {
    if (production) {
      return;
    } else {
      if (maxSize > 100) maxSize = 100;
      this._debugValue[this._maxSizeKey] = maxSize;
    }
  }

  /**
   * The minimum number of wins required to be added to the leaderboard.
   *
   * @returns {number} Number of wins to exceed in order to be added to the leaderboard.
   */
  async getLeaderboardThreshold() {
    if (production) {
      return;
    } else {
      if (!(this._key in this._debugValue)) return 0;

      const leaderboard = await this.getValue();
      const maxSize = await this.getMaxSize();

      if (leaderboard.length < maxSize) {
        return 0;
      }

      return leaderboard[maxSize - 1].score;
    }
  }

  /**
   * Add an entry to the leaderboard.
   * Fails if the entry doesn't meet the minimum leaderboard threshold.
   *
   * @param {LeaderboardEntry} entry The entry to add to the leaderboard.
   */
  async addLeaderboardEntry(entry) {
    if (production) {
      return;
    } else {
      // NOTE: The produciton & dev versions of this action are implemented completely differently.
      // Do not look here for insight into how the production code works.
      // These two methods of execution will have different time complexities as well.
      if (!(this._key in this._debugValue)) {
        this._debugValue[this._key] = [];
      }

      const leaderboard = await this.getValue();
      const maxSize = await this.getMaxSize();

      if (leaderboard.length >= maxSize) {
        if (entry.score <= leaderboard[maxSize - 1].score) return;
      }

      leaderboard.push(entry);
      leaderboard.sort((a, b) => {
        return b.score - a.score;
      });

      this._debugValue[this._key] = leaderboard;
    }
  }

  /**
   * Empties the leaderboard.
   */
  async clear() {
    if (production) {
      return;
    } else {
      if (!(this._key in this._debugValue)) return;

      this._debugValue[this._key] = [];
    }
  }
}

module.exports = LeaderboardModel;
