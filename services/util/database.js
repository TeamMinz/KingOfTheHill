const {REDIS_HOST} = require('../util/options');
const Redis = require('ioredis');
const fs = require('fs');

const redis = new Redis({
  lazyConnect: true,
  host: REDIS_HOST,
});


const production = process.env.NODE_ENV == 'production';

console.log('Running in production mode: ' + production);

if (production) {
  redis.connect();
}


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

