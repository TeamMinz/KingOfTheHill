const {getRedis} = require('../util/database');

const redis = getRedis();

/**
 *
 */
class SelectionMessageModel {
  /**
   * @param channelId
   */
  constructor(channelId) {
    this._channelId = channelId;
  }

  /**
   * @param {string} selectionMessage
   */
  async setValue(selectionMessage) {
    await redis.set(`${this._channelId}_selection_message`, selectionMessage);
  }

  /**
   * @returns {string} selection message.
   */
  async getValue() {
    const resp = await redis.get(`${this._channelId}_selection_message`);
    return resp;
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
  }

  /**
   * @param matchup
   */
  async setValue(matchup) {
    if (!matchup) {
      await redis.del(`${this._channelId}_matchup_champion`);
      await redis.del(`${this._channelId}_matchup_challenger`);
      return;
    }

    const {champion, challenger} = matchup;

    const champStr = JSON.stringify(champion);
    const challStr = JSON.stringify(challenger);

    await redis.set(`${this._channelId}_matchup_champion`, champStr);
    await redis.set(`${this._channelId}_matchup_challenger`, challStr);
  }

  /**
   * Gets the current matchup
   *
   * @returns Current matchup
   */
  async getValue() {
    const matchup = {};

    const champStr = await redis.get(`${this._channelId}_matchup_champion`);
    const challStr = await redis.get(`${this._channelId}_matchup_challenger`);

    if (!champStr || !challStr) {
      return null;
    }

    const champ = JSON.parse(champStr);
    const challenger = JSON.parse(challStr);

    matchup.champion = champ;
    matchup.challenger = challenger;

    return matchup;
  }
}

module.exports = {MatchupModel, SelectionMessageModel};
