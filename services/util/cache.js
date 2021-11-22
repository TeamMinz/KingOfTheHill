const {getRedis} = require('./database.js');

/**
 * Retrieves a cached value from the cache server.
 *
 *
 * @param {string} key the key of the value to retrieve.
 * @returns {undefined | any} The value stored at that key. Undefined if the key doesn't exist
 */
const getCacheValue = async (key) => {
  const redis = getRedis();

  return JSON.parse(await redis.get(`cache_${key}`));
};

/**
 * Assigns a value to a specific key.
 *
 * @param {string} key they key of the value to reassign.
 * @param {any} value the value to assign.
 */
const setCacheValue = async (key, value) => {
  const redis = getRedis();

  await redis.set(`cache_${key}`, JSON.stringify(value));
};

module.exports = {
  getCacheValue,
  setCacheValue,
};
