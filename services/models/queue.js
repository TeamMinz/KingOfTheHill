const {getRedis, loadScript} = require('../util/database');

const redis = getRedis();

const production = process.env.NODE_ENV == 'production';

if (production) {
  redis.on('connect', () => {
    // Load our redis query scripts
    loadScript('removeUser', 'redis/remove_user.lua');
    loadScript('insertAt', 'redis/insert_at.lua');
  });
}

/**
 * The data structure responsible for interfacing with redis and storing / retreiving the state of the queue.
 */
class QueueModel {
  /**
   * @param {string} channelId the channel that this queuemodel belongs to.
   */
  constructor(channelId) {
    this._channelId = channelId;
    this._key = `${this._channelId}_queue_content`;
    this._openKey = `${this._channelId}_queue_is_open`;
    this._debugValue = [];
  }

  /**
   * @param {any} challenger challenger
   * @returns {number | string} the current length of the queue.
   */
  async push(challenger) {
    if (production) {
      const resp =
        await redis
            .rpush(
                this._key,
                JSON.stringify(challenger),
            );
      return resp;
    } else {
      return this._debugValue.push(JSON.stringify(challenger));
    }
  }

  /**
   * Removes the first challenger from the queue.
   *
   * @returns {any} the challenger removed from the queue.
   */
  async shift() {
    if (production) {
      const resp =
        await redis.lpop(this._key);
      return JSON.parse(resp);
    } else {
      const resp = this._debugValue.pop();
      return JSON.parse(resp);
    }
  }

  /**
   * Removes the element at a specific index from the queue.
   *
   * @param {string} userId the id of the challenger to remove.
   * @returns {import('../controller/queue').Challenger | null} The challenger removed, or null if none.
   */
  async remove(userId) {
    if (production) {
      const resp =
        await redis.removeUser(this._key, userId);

      return JSON.parse(resp);
    } else {
      let resp = null;
      this._debugValue = this._debugValue.filter((element) => {
        const c = JSON.parse(element);
        if (c.userId == userId || c.opaqueUserId == userId) {
          resp = c;
          return false;
        }

        return true;
      });
      return resp;
    }
  }

  /**
   * Returns the contents of this QueueModel.
   *
   * @returns {Array<any>} The current state of the queue as an array.
   */
  async getValue() {
    if (production) {
      const resp = await redis.lrange(this._key, 0, -1);

      return resp.map((str) => {
        return JSON.parse(str);
      });
    } else {
      return this._debugValue.map((str) => {
        return JSON.parse(str);
      });
    }
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

    if (production) {
      await redis
          .insertAt(this._key,
              index,
              JSON.stringify(challenger));
    } else {
      this._debugValue.splice(index, 0, JSON.stringify(challenger));
    }
  }

  /**
   * Gets whether the queue is opened.
   *
   * @returns {boolean} true if open, false if closed.
   */
  async isOpen() {
    if (production) {
      const resp = await redis.get(this._openKey);

      if (!resp) {
        return false;
      }

      return resp === 'true';
    } else {
      return this._debugValue[this._openKey] === 'true';
    }
  }

  /**
   * Sets the queue as open.
   */
  async setOpen() {
    if (production) {
      await redis.set(this._openKey, 'true');
    } else {
      this._debugValue[this._openKey] = 'true';
    }
  }

  /**
   * Sets the queue as closed.
   */
  async setClosed() {
    if (production) {
      await redis.set(this._openKey, 'false');
      await redis.del(this._key);
    } else {
      this._debugValue[this._openKey] = 'false';
      this._debugValue[this._key] = null;
    }
  }
}

module.exports = {
  QueueModel,
};
