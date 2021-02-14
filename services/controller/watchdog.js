const tmi = require('tmi.js');

const client = new tmi.Client({
  options: {
    debug: process.env.NODE_ENV != 'production',
    connection: {
      reconnect: true,
    },
  },
});

client.connect();

client.on('message', (channel, userstate, message, _) => {

});

/**
 *
 */
class Watchdog {
  /**
   * @param {string | number} channelId id of associated channel
   */
  constructor(channelId) {
    this._channelId = channelId;
    this._channelName = null;
    this._isActive = false;
  }

  /**
   * Activates the watchdog.
   */
  async activate() {}

  /**
   * Deactivates the watchdog
   */
  async deactivate() {}

  /**
   * @returns {boolean} whether the watchdog is active.
   */
  isActive() {
    return this._isActive;
  }
}

const channelWatchdogs = {};

/**
 * Fetches or creates a new chat watchdog associated with a channel.
 *
 * @param {string|number} channelId the channel to associate with.
 * @returns {Watchdog} watchdog.
 */
function getWatchdog(channelId) {
  if (!channelWatchdogs[channelId]) {
    channelWatchdogs[channelId] = new Watchdog(channelId);
  }

  const watchdog = channelWatchdogs[channelId];

  return watchdog;
}
