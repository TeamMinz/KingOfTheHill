const Redis = require('ioredis');
const fs = require('fs');

const redis = new Redis();


/**
 * Public function to close the redis connection.
 */
const cleanupRedis = () => {
  redis.disconnect();
};

/**
 * @returns redis.
 */
const getRedis = () => {
  return redis;
};

/**
 * @param {string} name The name to cache the script under
 * @param {string} path The path to the script file.
 */
const loadScript = (name, path) => {
  const src = fs.readFileSync(`${__dirname}/${path}`);

  redis.defineCommand(name, {
    lua: src,
    numberOfKeys: 1,
  });
};


module.exports = {
  cleanupRedis,
  getRedis,
  loadScript,
};

