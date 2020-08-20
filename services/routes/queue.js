// eslint-disable-next-line new-cap
const queue = require('express').Router();
const {broadcast} = require('../util/pubsub.js');

const queueUpdateIntervalMs = 1000;
const channelQueues = {};
const updatedQueues = {}; // true if we need to publish an update to pubsub

/**
 * @typedef {object} Challenger
 * @property {string} opaqueUserId The opaque id of the user.
 */

// eslint-disable-next-line max-len
// TODO: I have plans to move all of these functions into a separate class later.

/**
 * Searches a queue for a person.
 *
 * @param {*} channelId The channel who's queue to search.
 * @param {*} opaqueUserId The user to search for.
 * @returns {number} The current position in the queue or -1 if not in queue.
 */
function getQueuePosition(channelId, opaqueUserId) {
  if (channelQueues[channelId]) {
    return channelQueues[channelId].findIndex((challenger) => {
      //console.log(opaqueUserId);
      //console.log(challenger.opaqueUserId);
      //return challenger.opaqueUserId == opaqueUserId;
      return true;
    });
  } else {
    return -1;
  }
};

/**
 * Adds a challenger to the back of the specifed queue.
 * @param {*} channelId The channel who's queue to add to.
 * @param {Challenger} challenger The challenger to add to the queue.
 * @returns The position of the element inserted into the queue.
 */
function enqueueChallenger(channelId, challenger) {
  const queue = channelQueues[channelId] || [];
  queue.push(challenger);

  channelQueues[channelId] = queue;
  updatedQueues[channelId] = true;

  return queue.length;
}

/**
 * Removes the top challenger from the queue.
 * @param {*} channelId the channel whos queue to pull from.
 * @returns {Challenger} The challenger pulled from the queue.
 */
function dequeueChallenger(channelId) {
  return null;
}

/**
 * Removes the specified challenger from the queue.
 * @param {*} channelId The channel whos queue to remove from.
 * @param {*} opaqueUserId The user to remove from the queue.
 * @returns {object} The challenger that was removed.
 */
function removeChallenger(channelId, opaqueUserId) {
  let challenger = null;
  const queue = channelQueues[channelId] || [];

  channelQueues[channelId] = queue.filter((c) => {
    if (c.opaqueUserId == opaqueUserId) {
      challenger = c;
      return false;
    }

    return true;
  });
  updatedQueues[channelId] = true;
  return challenger;
}

/**
 * Inserts a challenger at the specieifed position in the queue.
 * 0 being the the first slot in the queue.
 * @param {*} channelId The channel whos queue to insert into.
 * @param {*} challenger The challenger to insert into the queue.
 * @param {*} position The position to insert the challenger into.
 */
function insertChallenger(channelId, challenger, position) {

}

queue.get('/get', function(req, res) {
  const {channel_id: channelId, opaque_user_id: opaqueUserId} = req.twitch;

  const currentQueue = channelQueues[channelId] || [];
  const currentPosition = getQueuePosition(currentQueue, opaqueUserId);

  res.send({queue: currentQueue, position: currentPosition});
});

queue.post('/join', function(req, res) {
  // Handles joining the queue.
  const {channel_id: channelId, opaque_user_id: opaqueUserId} = req.twitch;

  // Some checks to make sure we're not doing anything bad ...
  // If the user is not signed into twitch, they cannot join the queue.
  if (opaqueUserId.startsWith('A')) {
    res.status(401).send({
      message: 'You must sign in to join the queue.',
    });
    return;
  }

  // Make sure this person isn't already in this queue.
  if (getQueuePosition(channelId, opaqueUserId) != -1) {
    res.status(500).send({
      message: 'You are already in the queue.',
    });
    return;
  }

  // Okay time to actually put the user in the queue.

  const challenger = {
    opaqueUserId,
  };

  console.log(req.twitch);

  const queuePosition = enqueueChallenger(channelId, challenger);

  res.send({
    message: `You are now #${queuePosition} in the queue.`,
  }); // All done.
});

queue.post('/leave', function(req, res) {
  // Handles leaving the queue.
  const {channel_id: channelId, opaque_user_id: opaqueUserId} = req.twitch;

  // Lets do some checks to make sure were not doing anything bad.

  // Make sure this person is actually in this queue.
  if (getQueuePosition(channelId, opaqueUserId) == -1) {
    res.status(500).send({
      message: 'You cannot leave a queue you\'re not in.',
    });
    return;
  }

  // Okay. lets remove them from the queue.
  removeChallenger(channelId, opaqueUserId);

  console.log(channelQueues[channelId]);

  res.send({
    message: 'You have been removed from the queue.',
  });
});

module.exports = queue;

// Check if each queue has changed, then if it has publish it.
setInterval(function() {
  for (const channelId in channelQueues) {
    if (channelQueues.hasOwnProperty(channelId) && updatedQueues[channelId]) {
      const queue = channelQueues[channelId];

      const message = {
        type: 'updateQueue',
        message: queue,
      };

      broadcast(channelId, message);

      updatedQueues[channelId] = false; // mark this so we don't update again
    }
  }
}, queueUpdateIntervalMs);
