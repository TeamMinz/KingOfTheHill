const {getRedis, loadScript} = require('../util/database');

const redis = getRedis();

redis.on('connect', () => {
  // Load our redis query scripts
  loadScript('removeUser', 'redis/remove_user.lua');
  loadScript('insertAt', 'redis/insert_at.lua');
});

/**
 * The data structure responsible for interfacing with redis and storing / retreiving the state of the queue.
 */
class QueueModel {
  /**
   * @param {string} channelId the channel that this queuemodel belongs to.
   */
  constructor(channelId) {
    this._channelId = channelId;
  }

  /**
   * @param {any} challenger challenger
   * @returns {number | string} the current length of the queue.
   */
  async push(challenger) {
    const resp =
        await redis
            .rpush(
                `${this._channelId}_queue_content`,
                JSON.stringify(challenger),
            );
    return resp;
  }

  /**
   * Removes the first challenger from the queue.
   *
   * @returns {any} the challenger removed from the queue.
   */
  async shift() {
    const resp =
      await redis.lpop(`${this._channelId}_queue_content`);
    return JSON.parse(resp);
  }

  /**
   * Removes the element at a specific index from the queue.
   *
   * @param {string} userId the id of the challenger to remove.
   * @returns {import('../controller/queue').Challenger | null} The challenger removed, or null if none.
   */
  async remove(userId) {
    const resp =
      await redis.removeUser(`${this._channelId}_queue_content`, userId);

    return JSON.parse(resp);
  }

  /**
   * Returns the contents of this QueueModel.
   *
   * @returns {Array<any>} The current state of the queue as an array.
   */
  async getValue() {
    const resp = await redis.lrange(`${this._channelId}_queue_content`, 0, -1);

    return resp.map((str) => {
      return JSON.parse(str);
    });
  }

  /**
   * Inserts the challenger at a specific index.
   *
   * @param {Challenger} challenger The challenger to insert
   * @param {number} index The index at which the challenger is to be inserted. Must be > 0
   */
  async insertAt(challenger, index) {
    if (index < 0) {
      return;
    }

    await redis
        .insertAt(`${this._channelId}_queue_content`,
            index,
            JSON.stringify(challenger));
  }

  /**
   * Gets whether the queue is opened.
   *
   * @returns {boolean} true if open, false if closed.
   */
  async isOpen() {
    const resp = await redis.get(`${this._channelId}_queue_is_open`);

    if (!resp) {
      return false;
    }

    return resp === 'true';
  }

  /**
   * Sets the queue as open.
   */
  async setOpen() {
    await redis.set(`${this._channelId}_queue_is_open`, 'true');
  }

  /**
   * Sets the queue as closed.
   */
  async setClosed() {
    await redis.set(`${this._channelId}_queue_is_open`, 'false');
    await redis.del(`${this._channelId}_queue_content`);
  }
}

module.exports = {
  QueueModel,
};
