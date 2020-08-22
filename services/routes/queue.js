// eslint-disable-next-line new-cap
const queue = require('express').Router();
const {broadcast} = require('../util/pubsub');
const {resolveDisplayName} = require('../util/twitch');
const {getQueue, getAllQueues} = require('../controller/queue');

const queueUpdateIntervalMs = 1000;

// Set up our routes.
queue.get('/get', function(req, res) {
  const {channel_id: channelId, opaque_user_id: opaqueUserId} = req.twitch;

  const currentQueue = getQueue(channelId);
  const currentPosition = currentQueue.getPosition(opaqueUserId);

  res.send({queue: currentQueue.getAsArray(), position: currentPosition});
});

queue.post('/join', async (req, res) => {
  // Handles joining the queue.
  const {
    channel_id: channelId,
    opaque_user_id: opaqueUserId,
    user_id: userId,
  } = req.twitch;

  /* if (!userId) {
    res.status(401).send({
      message: 'You must share your identity to enter the queue.',
    });
    return;
  }*/

  // Some checks to make sure we're not doing anything bad ...
  // If the user is not signed into twitch, they cannot join the queue.
  if (opaqueUserId.startsWith('A')) {
    res.status(401).send({
      message: 'You must sign in to join the queue.',
    });
    return;
  }

  // Make sure this person isn't already in this queue.
  const currentQueue = getQueue(channelId);

  if (currentQueue.contains(opaqueUserId)) {
    res.status(500).send({
      message: 'You are already in the queue.',
    });
    return;
  }

  // Lets grab this person's display name from twitch.
  const displayName = await resolveDisplayName(userId);

  // Okay time to actually put the user in the queue.

  const challenger = {
    opaqueUserId,
    displayName,
  };

  const queuePosition = currentQueue.enqueue(challenger);

  res.send({
    message: `You are now #${queuePosition} in the queue.`,
  }); // All done.
});

queue.post('/leave', function(req, res) {
  // Handles leaving the queue.
  const {channel_id: channelId, opaque_user_id: opaqueUserId} = req.twitch;

  const currentQueue = getQueue(channelId);

  // Lets do some checks to make sure were not doing anything bad.

  // Make sure this person is actually in this queue.
  if (!currentQueue.contains(opaqueUserId)) {
    res.status(500).send({
      message: 'You cannot leave a queue you\'re not in.',
    });
    return;
  }

  // Okay. lets remove them from the queue.
  currentQueue.remove(opaqueUserId);
  // console.log(channelQueues[channelId]);

  res.send({
    message: 'You have been removed from the queue.',
  });
});

module.exports = queue;

// Check if each queue has changed, then if it has publish it.
// TODO: we want to change this, so that instead of just sending out all
// ... queues, we look for all live channels, then send out their queues.
setInterval(function() {
  const channelQueues = getAllQueues();
  for (const channelId in channelQueues) {
    if (channelQueues.hasOwnProperty(channelId)) {
      const queue = channelQueues[channelId];

      if (queue.hasUpdated) {
        const message = {
          type: 'updateQueue',
          message: queue.getAsArray(),
        };
        broadcast(channelId, message);
        queue.hasUpdated = false; // mark this so we don't update until a change
      }
    }
  }
}, queueUpdateIntervalMs);
