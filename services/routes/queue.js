// eslint-disable-next-line new-cap
const queue = require('express').Router();
const {broadcast} = require('../util/pubsub.js');

const queueUpdateIntervalMs = 1000;
const channelQueues = {};
const updatedQueues = {}; // true if we need to publish an update to pubsub

const getQueuePosition = (currentQueue, opaqueUserId) => {
  return currentQueue.indexOf(opaqueUserId);
};

queue.get('/get', function(req, res) {
  const {channel_id: channelId, opaque_user_id: opaqueUserId} = req.twitch;

  const currentQueue = channelQueues[channelId] || [];
  const currentPosition = getQueuePosition(currentQueue, opaqueUserId);

  res.send({queue: currentQueue, position: currentPosition});
});

queue.post('/join', function(req, res) {
  // Handles joining the queue.
  const {channel_id: channelId, opaque_user_id: opaqueUserId} = req.twitch;

  const currentQueue = channelQueues[channelId] || [];

  // If the user is not signed into twitch, they cannot join the queue.
  if (opaqueUserId.startsWith('A')) {
    res.status(401).send({
      message: 'You must sign in to join the queue.',
    });
    return;
  }

  if (currentQueue.includes(opaqueUserId)) {
    res.status(500).send({
      message: 'You are already in the queue.',
    });
    return;
  }

  currentQueue.push(opaqueUserId);

  // Update the queue, then mark that queue as updated, so we know to publish
  channelQueues[channelId] = currentQueue;
  updatedQueues[channelId] = true;

  res.send({
    message: `You are now #${currentQueue.length} in the queue.`,
  });
});

queue.post('/leave', function(req, res) {
  // Handles leaving the queue.
  const {channel_id: channelId, opaque_user_id: opaqueUserId} = req.twitch;

  const currentQueue = channelQueues[channelId];

  if (!currentQueue) {
    res.status(500).send({
      message: 'Something went wrong. Please try again later.',
    });
    return;
  }

  if (!currentQueue.includes(opaqueUserId)) {
    res.status(500).send({
      message: 'You cannot leave a queue you\'re not in.',
    });
    return;
  }

  // Update the queue, then mark that queue as updated, so we know to publish.
  channelQueues[channelId] =
    currentQueue.filter((qmember) => (qmember != opaqueUserId));
  updatedQueues[channelId] = true;

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
