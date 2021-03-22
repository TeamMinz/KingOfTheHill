const {Chat} = require('twitch-js');
const {resolveChannelName} = require('../util/twitch');
const {getQueue} = require('./queue');
const {getMatchup} = require('./matchup');
const {getChampion, setChampion} = require('./champion');
const {EXT_BOT_OAUTH} = require('../util/options');


const client = new Chat({
  username: 'kingofthehillbot',
  token: EXT_BOT_OAUTH,
  log: {
    level: 'warn',
  },
});

client.connect()
    .then((userstate) => {
      console.log('Connected to twitch chat IRC backend.');

      client.on('PRIVMSG', async (message) => {
        if (message.isSelf) return;
        if (!(message.message == '!join' ||
            message.message == '!leave' ||
            message.message == '!position')) return;

        const senderId = message.tags.userId;
        const senderName = message.username;
        const channelId = message.tags.roomId;
        const channel = message.channel;

        console.log('Received command: ' + message.message);

        /**
         * @param {string} message Message to send to the command issuer.
         */
        const sendTargetedMessage = (message) => {
          client.say(channel, `@${senderName} ${message}`)
              .catch(console.error);
        };

        const queue = getQueue(channelId);
        const matchup = await getMatchup(channelId);

        if (message.message == '!join') {
          if (!queue.isOpen()) {
            sendTargetedMessage('You cannot join a closed queue.');
            return;
          }

          if (matchup) {
            if (
              matchup.champion.displayName == senderName ||
              matchup.challenger.displayName == senderName
            ) {
              sendTargetedMessage(
                  'You may not join the queue if you are currently in a match');
              return;
            }
          }

          if (await queue.contains(senderId)) {
            sendTargetedMessage('You are already in the queue.');
            return;
          }

          const challenger = {
            displayName: senderName,
            userId: senderId,
            // eslint-disable-next-line max-len
            opaqueUserId: senderId, // TODO: this is done here for backwards compatibility.
          }; // Remove that when 1.0.0 is relased.

          const queuePosition = await queue.enqueue(challenger);

          sendTargetedMessage(`You are now #${queuePosition} in the queue.`);
        } else if (message.message == '!leave') {
          if (!await queue.contains(senderId)) {
            sendTargetedMessage('You cannot leave a queue you\'re not in.');
            return;
          }

          const champ = await getChampion(channelId);

          if (champ && champ.user.userId == senderId) {
            await setChampion(channelId, null);
          }

          await queue.remove(senderId);
        } else if (message.message == '!position') {
          if (!await queue.contains(senderId)) {
            sendTargetedMessage('You are not currently in the queue.');
            return;
          }

          const queuePosition = await queue.getPosition(senderId);
          sendTargetedMessage(`You are in position: #${queuePosition + 1}.`);
        }
      });
    })
    .catch(console.error);

/**
 * Watches chat for our commands, and executes them.
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
  async activate() {
    if (!this._channelName) {
      this._channelName = await resolveChannelName(this._channelId);
    }
    await client.join(this._channelName);
    this._isActive = true;
    console.log(`Activated watchdog for channel: ${this._channelName}.`);
  }

  /**
   * Deactivates the watchdog
   */
  async deactivate() {
    await client.part(this._channelName);
    this._isActive = false;
    console.log(`Deactivated watchdog for channel: ${this._channelName}.`);
  }

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

module.exports = {getWatchdog};
