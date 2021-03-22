const {QueueModel} = require('../models/queue');

/**
 * @typedef {object} Challenger
 * @property {string} [opaqueUserId] The opaque id of the user.
 * @property {string} displayName The display name of the user.
 * @property {string | number} userId the id of the user.
 */
class Queue {
  /**
   * Constructor
   *
   * @param {string} channelId the channel that this queue belongs to.
   */
  constructor(channelId) {
    this._model = new QueueModel(channelId);
    this._channelId = channelId;
    this.hasUpdated = false;
    this._isOpen = false;
  }
  /**
   * Determines whether a queue contains a specified person.
   *
   * @param {string | number} userId The person to search for.
   * @returns {boolean} true if person is in queue otherwise false.
   */
  async contains(userId) {
    return (await this.getPosition(userId)) != -1;
  }
  /**
   * Searches a queue for a person.
   *
   * @param {string} userId The user to search for.
   * @returns {number} The current position in the queue or -1 if not in queue.
   */
  async getPosition(userId) {
    return (await this._model.getValue()).findIndex((challenger) =>
      (challenger.userId == userId || challenger.opaqueUserId == userId));
  }
  /**
   * Adds a challenger to the back of the queue.
   *
   * @param {Challenger} challenger The challenger to add to the queue.
   * @returns {number} The position of the element inserted into the queue.
   */
  async enqueue(challenger) {
    const resp = await this._model.push(challenger);
    this.hasUpdated = true;
    return resp;
  }
  /**
   * Removes the top challenger from the queue.
   *
   * @returns {Challenger} The challenger pulled from the queue.
   */
  async dequeue() {
    const challenger = await this._model.shift();
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
  async insert(pos, user) {
    await this._model.insertAt(user, pos);
    this.hasUpdated = true;
  }
  /**
   * Removes the specified challenger from the queue.
   *
   * @param {string | number} userId The user to remove from the queue.
   * @returns {object | null} The challenger that was removed. Null if not found.
   */
  async remove(userId) {
    const resp = await this._model.remove(userId);

    if (resp) {
      this.hasUpdated = true;
    }

    return resp;
  }
  /**
   * Marks this queue as open.
   */
  async openQueue() {
    await this._model.setOpen();
    this.hasUpdated = true;
  }
  /**
   * Mark this queue as closed, and clear the queue.
   */
  async closeQueue() {
    await this._model.setClosed();
    this.hasUpdated = true;
  }
  /**
   * Checks if this queue is open.
   *
   * @returns {boolean} true if open false otherwise.
   */
  async isOpen() {
    return await this._model.isOpen();
  }
  /**
   * Get this queue represented as an array.
   *
   * @returns {Array} the array representation of this queue.
   */
  async getAsArray() {
    return await this._model.getValue();
  }
  /**
   * Get the number of people currently in this queue.
   *
   * @returns {number} the number of people in the queue.
   */
  async getSize() {
    return (await this._model.getValue()).length;
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
    channelQueues[channelId] = new Queue(channelId);
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
