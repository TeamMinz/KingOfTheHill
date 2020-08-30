/**
 * @typedef {object} Challenger
 * @property {string} opaqueUserId The opaque id of the user.
 */
class Queue {
  /**
   * Constructor
   */
  constructor() {
    this._queue = [];
    this.hasUpdated = false;
  }
  /**
   * Determines whether a queue contains a specified person.
   *
   * @param {*} opaqueUserId The person to search for.
   * @returns {boolean} true if person is in queue otherwise false.
   */
  contains(opaqueUserId) {
    return this.getPosition(opaqueUserId) != -1;
  }
  /**
   * Searches a queue for a person.
   *
   * @param {*} opaqueUserId The user to search for.
   * @returns {number} The current position in the queue or -1 if not in queue.
   */
  getPosition(opaqueUserId) {
    return this._queue.findIndex((challenger) =>
      (challenger.opaqueUserId == opaqueUserId));
  }
  /**
   * Adds a challenger to the back of the queue.
   *
   * @param {Challenger} challenger The challenger to add to the queue.
   * @returns {number} The position of the element inserted into the queue.
   */
  enqueue(challenger) {
    this._queue.push(challenger);
    this.hasUpdated = true;
    return this._queue.length;
  }
  /**
   * Removes the top challenger from the queue.
   *
   * @returns {Challenger} The challenger pulled from the queue.
   */
  dequeue() {
    const challenger = this._queue.shift();
    this.hasUpdated = true;
    return challenger;
  }
  /**
   * Inserts user into specified spot in the queue,
   * shifting everyone after that spot back a space.
   *
   * @param {*} pos the position to insert into the queue in.
   * @param {*} user the user to insert into the queue.
   */
  insert(pos, user) {
    this._queue.splice(pos, 0, user);
    this.hasUpdated = true;
  }
  /**
   * Removes the specified challenger from the queue.
   *
   * @param {*} opaqueUserId The user to remove from the queue.
   * @returns {object} The challenger that was removed.
   */
  remove(opaqueUserId) {
    let challenger = null;

    this._queue = this._queue.filter((c) => {
      if (c.opaqueUserId == opaqueUserId) {
        challenger = c;
        return false;
      }

      return true;
    });
    this.hasUpdated = true;
    return challenger;
  }
  /**
   * Get this queue represented as an array.
   *
   * @returns {Array} the array representation of this queue.
   */
  getAsArray() {
    return this._queue;
  }
  /**
   * Get the number of people currently in this queue.
   *
   * @returns {number} the number of people in the queue.
   */
  getSize() {
    return this._queue.length;
  }
}

const channelQueues = {};
/**
 * Gets a channels queue, or creates one
 * if none exists.
 *
 * @param {*} channelId the channel who's queue to fetch.
 * @returns {Queue} the queue of the specified channel.
 */
function getQueue(channelId) {
  if (!channelQueues[channelId]) {
    channelQueues[channelId] = new Queue();
  }

  return channelQueues[channelId];
}
/**
 * Gets all queues.
 *
 * @returns {object} an object containing all the queues.
 */
function getAllQueues() {
  return channelQueues;
}

module.exports = {
  getQueue,
  getAllQueues,
};
