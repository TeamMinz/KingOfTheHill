const Redis = require('ioredis');

const redis = new Redis();

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
   * @param {import('../controller/queue').Challenger} challenger challenger
   */
  async push(challenger) {
    const resp =
        await redis
            .lpush(
                `${this._channelId}_queue_content`,
                JSON.stringify(challenger),
            );

    return resp;
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
}

module.exports = QueueModel;
