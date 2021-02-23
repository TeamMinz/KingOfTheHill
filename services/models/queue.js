const Redis = require('ioredis');
const fs = require('fs');

const redis = new Redis();

/**
 * @param name
 * @param path
 */
const loadScript = (name, path) => {
  const src = fs.readFileSync(`${__dirname}/${path}`);

  redis.defineCommand(name, {
    lua: src,
    numberOfKeys: 1,
  });
};

redis.connect(() => {
  // Load our redis query scripts
  loadScript('removeAt', 'redis/remove_at.lua');
  loadScript('insertAt', 'redis/insert_at.lua');
});

/**
 *
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
   */
  async push(challenger) {
    const resp =
        await redis
            .rpush(
                `${this._channelId}_queue_content`,
                JSON.stringify(challenger),
            );
    console.log(resp);
    return resp;
  }

  /**
   *
   */
  async shift() {
    const resp =
      await redis.lpop(`${this._channelId}_queue_content`);
    return JSON.parse(resp);
  }

  /**
   * @param {number} index index of the element to remove.
   */
  async removeAt(index) {
    const resp =
      await redis.removeAt(`${this._channelId}_queue_content`, index);

    return JSON.parse(resp);
  }

  /**
   * Returns the contents of this QueueModel.
   */
  async getValue() {
    const resp = await redis.lrange(`${this._channelId}_queue_content`, 0, -1);

    return resp.map((str) => {
      return JSON.parse(str);
    });
  }

  /**
   * @param challenger
   * @param index
   */
  async insertAt(challenger, index) {
    console.log('Insert: ' + await redis
        .insertAt(`${this._channelId}_queue_content`,
            index,
            JSON.stringify(challenger)));
  }

  /**
   *
   */
  async isOpen() {
    const resp = await redis.get(`${this._channelId}_queue_is_open`);

    if (!resp) {
      return false;
    }

    return resp === 'true';
  }

  /**
   *
   */
  async setOpen() {
    await redis.set(`${this._channelId}_queue_is_open`, 'true');
  }

  /**
   *
   */
  async setClosed() {
    await redis.set(`${this._channelId}_queue_is_open`, 'false');
    await redis.del(`${this._channelId}_queue_content`);
  }
}

module.exports = QueueModel;
