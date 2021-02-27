const {getRedis} = require('../util/database');

const redis = getRedis();

const production = process.env.NODE_ENV == 'production';

/**
 *
 */
class SelectionMessageModel {
  /**
   * @param channelId The channel that this selection model is for.
   */
  constructor(channelId) {
    this._channelId = channelId;
    this._debugValue = {};
    this._key = `${this._channelId}_selection_message`;
  }

  /**
   * @param {string} selectionMessage The selection message to set.
   */
  async setValue(selectionMessage) {
    if (production) {
      await redis.set(this._key, selectionMessage);
    } else {
      this._debugValue[this._key] = selectionMessage;
    }
  }

  /**
   * @returns {string} selection message.
   */
  async getValue() {
    if (production) {
      const resp = await redis.get(`${this._channelId}_selection_message`);
      return resp;
    } else {
      return this._debugValue[this._key];
    }
  }
}

/**
 * Database model representing a matchup.
 */
class MatchupModel {
  /**
   * @param {string} channelId the channel that this queuemodel belongs to.
   */
  constructor(channelId) {
    this._channelId = channelId;
    this._champKey = `${this._channelId}_matchup_champion`;
    this._challKey = `${this._channelId}_matchup_challenger`;
    this._debugValue = {};
  }

  /**
   * @param {any} matchup The matchup to set
   */
  async setValue(matchup) {
    if (!matchup) {
      if (production) {
        await redis.del(this._champKey);
        await redis.del(this._challKey);
      } else {
        this._debugValue[this._champKey] = undefined;
        this._debugValue[this._challKey] = undefined;
      }
      return;
    }

    const {champion, challenger} = matchup;

    const champStr = JSON.stringify(champion);
    const challStr = JSON.stringify(challenger);

    if (production) {
      await redis.set(this._champKey, champStr);
      await redis.set(this._challKey, challStr);
    } else {
      this._debugValue[this._champKey] = champStr;
      this._debugValue[this._challKey] = challStr;
    }
  }

  /**
   * Gets the current matchup
   *
   * @returns Current matchup
   */
  async getValue() {
    const matchup = {};

    if (production) {
      const champStr = await redis.get(this._champKey);
      const challStr = await redis.get(this._challKey);

      if (!champStr || !challStr) {
        return null;
      }

      const champ = JSON.parse(champStr);
      const challenger = JSON.parse(challStr);

      matchup.champion = champ;
      matchup.challenger = challenger;
    } else {
      const champStr = this._debugValue[this._champKey];
      const challStr = this._debugValue[this._challKey];

      if (!champStr || !challStr) {
        return null;
      }

      const champ = JSON.parse(champStr);
      const challenger = JSON.parse(challStr);

      matchup.champion = champ;
      matchup.challenger = challenger;
    }
    return matchup;
  }
}

module.exports = {MatchupModel, SelectionMessageModel};
