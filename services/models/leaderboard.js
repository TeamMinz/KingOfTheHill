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
   * @param {string | number} channelId The id of the channel who's leaderboard this model represents.
   */
  constructor(channelId) {
    this._channelId = channelId;
    this._debugValue = {};
    this._key = `${this.channelId}_leaderboard`;
    this._maxSizeKey = `${this.channelId}_leaderboard_max_size`;
  }

  /**
   * @returns {LeaderboardEntry[]} The current state of the leaderboard
   */
  async getValue() {
    if (production) {
      const resp = await redis.get(this._key);
      if (resp) {
        return JSON.parse(resp);
      }
      return [];
    } else {
      if (!(this._key in this._debugValue)) return [];
      return this._debugValue[this._key];
    }
  }

  /**
   * Sets the value of the leaderboard in the database.
   * @param {LeaderboardEntry[]} value The new state of the leaderboard. 
   */
  async setValue(value) {
    if (production) {
      const enc_arr = JSON.stringify(value);
      await redis.set(this._key, enc_arr);
    } else {
      this._debugValue[this._key] = value;
    }
  }

  /**
   * @returns {number} The maximum number of entries on the leaderboard. Default 10
   */
  async getMaxSize() {
    if (production) {
      const resp = await redis.get(this._maxSizeKey);
      
      if (resp) {
        return parseInt(resp);
      } 
      return 10;
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
      if (maxSize > 100) maxSize = 100;
      await redis.set(this._maxSizeKey, maxSize);
    } else {
      if (maxSize > 100) maxSize = 100;
      this._debugValue[this._maxSizeKey] = maxSize;
    }
  }
}

module.exports = LeaderboardModel;
