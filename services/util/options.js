require('dotenv').config();
const yargs = require('yargs');

// Process command line arguments
const argv = yargs
    .describe('ownerid', 'The extension\'s owner id')
    .alias('o', 'ownerid')
    .describe('secret', 'The extension\'s secret')
    .alias('s', 'secret')
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

module.exports = {
  SECRET,
  OWNER_ID,
  CLIENT_ID,
};
