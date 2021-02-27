const {getRedis} = require('../util/database');

const production = process.env.NODE_ENV == 'production';

const redis = getRedis();

/**
 *
 */
class ChampionModel {
  /**
   * @param channelId
   */
  constructor(channelId) {
    this._channelId = channelId;
    this._debugValue = {};
    this._key = `${this._channelId}_current_champion`;
  }

  /**
   * Sets the value of the champion.
   *
   * @param value the value of the next champion.
   */
  async setValue(value) {
    const strValue = JSON.stringify(value);

    if (production) {
      await redis.set(this._key, strValue);
    } else {
      this._debugValue[this._key] = strValue;
    }
  }

  /**
   * @returns The current champion.
   */
  async getValue() {
    if (production) {
      const resp = await redis.get(this._key);

      if (resp) {
        return JSON.parse(resp);
      } else {
        return null;
      }
    } else {
      if (this._key in this._debugValue) {
        return JSON.parse(this._debugValue[this._key]);
      } else {
        return null;
      }
    }
  }
}

module.exports = {ChampionModel};
