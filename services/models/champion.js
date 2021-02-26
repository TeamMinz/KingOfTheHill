const {getRedis} = require('../util/database');

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
  }

  /**
   * @param value
   */
  async setValue(value) {
    const strValue = JSON.stringify(value);

    await redis.set(`${this._channelId}_current_champion`, strValue);
  }

  /**
   *
   */
  async getValue() {
    const resp = await redis.get(`${this._channelId}_current_champion`);

    if (resp) {
      return JSON.parse(resp);
    } else {
      return null;
    }
  }
}

module.exports = {ChampionModel};
