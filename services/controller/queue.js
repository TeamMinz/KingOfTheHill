/**
 * @typedef {object} Challenger
 * @property {string} [opaqueUserId] The opaque id of the user.
 * @property {string} displayName The display name of the user.
 * @property {string | number} userId the id of the user.
 */
class Queue {
  /**
   * Constructor
   */
  constructor() {
    this._queue = [];
    this.hasUpdated = false;
    this._isOpen = false;
  }
  /**
   * Determines whether a queue contains a specified person.
   *
   * @param {string | number} userId The person to search for.
   * @returns {boolean} true if person is in queue otherwise false.
   */
  contains(userId) {
    return this.getPosition(userId) != -1;
  }
  /**
   * Searches a queue for a person.
   *
   * @param {string} userId The user to search for.
   * @returns {number} The current position in the queue or -1 if not in queue.
   */
  getPosition(userId) {
    return this._queue.findIndex((challenger) =>
      (challenger.userId == userId || challenger.opaqueUserId == userId));
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
   * @param {number} pos the position to insert into the queue in.
   * @param {Challenger} user the user to insert into the queue.
   */
  insert(pos, user) {
    this._queue.splice(pos, 0, user);
    this.hasUpdated = true;
  }
  /**
   * Removes the specified challenger from the queue.
   *
   * @param {string | number} userId The user to remove from the queue.
   * @returns {object} The challenger that was removed.
   */
  remove(userId) {
    let challenger = null;

    this._queue = this._queue.filter((c) => {
      if (c.userId == userId || c.opaqueUserId == userId) {
        challenger = c;
        return false;
      }

      return true;
    });
    this.hasUpdated = true;
    return challenger;
  }
  /**
   * Marks this queue as open.
   */
  openQueue() {
    this._isOpen = true;
    this.hasUpdated = true;
  }
  /**
   * Mark this queue as closed, and clear the queue.
   */
  closeQueue() {
    this._isOpen = false;
    this._queue = [];
    this.hasUpdated = true;
  }
  /**
   * Checks if this queue is open.
   *
   * @returns {boolean} true if open false otherwise.
   */
  isOpen() {
    return this._isOpen;
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
 * @param {string | number} channelId the channel who's queue to fetch.
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
