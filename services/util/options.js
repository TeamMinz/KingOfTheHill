require('dotenv').config();
const yargs = require('yargs');

// Process command line arguments
const argv = yargs
    .describe('ownerid', 'The extension\'s owner id')
    .alias('o', 'ownerid')
    .describe('oauth', 'Oauth token for chatbot.')
    .alias('t', 'oauth')
    .describe('secret', 'The extension\'s secret')
    .alias('s', 'secret')
    .describe('redis', 'A URI representing the location of the redis backend.')
    .alias('r', 'redis')
    .describe('clientid', 'The extension\'s clientId')
    .alias('c', 'clientid').argv;

// Fetch some environment variables that we will need.

/**
 * @param {string} option
 *  The name of the option to get from the command line args.
 * @param {string} envOption
 *  The environment variable to fetch if there is no cli flag.
 * @returns {object} The specified option / environment variable if it exists.
 */
function getOption(option, envOption) {
  if (argv[option]) {
    return argv[option];
  } else if (process.env[envOption]) {
    return process.env[envOption];
  }
  // Panic
  throw new Error(`Missing required "${option}" environment variable.`);
}

const SECRET = Buffer.from(getOption('secret', 'EXT_SECRET'), 'base64');
const OWNER_ID = getOption('ownerid', 'EXT_OWNER_ID');
const CLIENT_ID = getOption('clientid', 'EXT_CLIENT_ID');
const CLIENT_SECRET = getOption('clientsecret', 'EXT_CLIENT_SECRET');
const EXT_BOT_OAUTH = getOption('oauth', 'EXT_BOT_OAUTH');
const REDIS_HOST = (() => {
  if (process.env.NODE_ENV == 'production') {
    try {
      const uri = getOption('redis', 'REDIS_URI');
      return uri;
    } catch (_e) {
      return '127.0.0.1';
    }
  } else {
    return null;
  }
})();

module.exports = {
  SECRET,
  OWNER_ID,
  CLIENT_ID,
  CLIENT_SECRET,
  EXT_BOT_OAUTH,
  REDIS_HOST,
  NODE_ENV: process.env.NODE_ENV,
};
