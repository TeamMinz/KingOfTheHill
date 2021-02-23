// eslint-disable-next-line new-cap
const queue = require('express').Router();
const {broadcast} = require('../util/pubsub');
const {resolveDisplayName, getBroadcasterConfig} = require('../util/twitch');
const {getQueue, getAllQueues} = require('../controller/queue');
const {getWatchdog} = require('../controller/watchdog');
const {getMatchup, setMatchup} = require('../controller/matchup');
const {getChampion, setChampion} = require('../controller/champion');
const {isBroadcaster, isQueueOpen} = require('../util/middleware');
const queueUpdateIntervalMs = 1000;

// Set up our routes.
queue.get('/get', async function(req, res) {
  const {channel_id: channelId, opaque_user_id: opaqueUserId} = req.twitch;

  const currentQueue = getQueue(channelId);
  const currentPosition = currentQueue.getPosition(opaqueUserId);

  res.send({
    queue: await currentQueue.getAsArray(),
    position: currentPosition,
    isOpen: await currentQueue.isOpen(),
  });
});

queue.post('/kick', isQueueOpen, async (req, res) => {
  const {channel_id: channelId, role} = req.twitch;

  const currentQueue = getQueue(channelId);

  if (!(role == 'broadcaster' || role == 'moderator')) {
    res.sendStatus(401);
    return;
  }

  if (!req.body.kickTarget) {
    res.sendStatus(400);
    return;
  }

  const kickTarget = req.body.kickTarget;

  if (currentQueue.getPosition(kickTarget) == -1) {
    res.status(400).send('Cannot kick someone not in the queue.');
    return;
  }

  const champ = getChampion(channelId);

  // Remove this person as champion if they're champ.
  if (champ &&
    (champ.user.opaqueUserId == kickTarget ||
      champ.user.userId == kickTarget)) {
    setChampion(channelId, null);
  }

  currentQueue.remove(kickTarget);
  res.sendStatus(200);
});

queue.post('/join', isQueueOpen, async (req, res) => {
  // Handles joining the queue.

  console.log('joining queue');

  const {
    channel_id: channelId,
    opaque_user_id: opaqueUserId,
    user_id: userId,
  } = req.twitch;

  if (!userId) {
    res.status(401).send({
      message: 'You must share your identity to enter the queue.',
    });
    return;
  }

  // Some checks to make sure we're not doing anything bad ...
  // If the user is not signed into twitch, they cannot join the queue.
  if (opaqueUserId.startsWith('A')) {
    res.status(401).send({
      message: 'You must sign in to join the queue.',
    });
    return;
  }

  const currentMatchup = getMatchup(channelId);

  if (currentMatchup) {
    if (
      currentMatchup.champion.userId == userId ||
      currentMatchup.challenger.userId == userId
    ) {
      res.status(500).send({
        message: 'You may not join the queue if you are in a current match.',
      });
      return;
    }
  }

  const currentQueue = getQueue(channelId);

  // Lets grab this person's display name from twitch.
  const displayName = await resolveDisplayName(userId);

  // Make sure this person isn't already in this queue.
  if (await currentQueue.contains(userId)) {
    res.status(500).send({
      message: 'You are already in the queue.',
    });
    return;
  }

  // Okay time to actually put the user in the queue.

  const challenger = {
    userId,
    opaqueUserId,
    displayName,
  };

  const queuePosition = await currentQueue.enqueue(challenger);
  console.log(queuePosition);
  res.send({
    message: `You are now #${queuePosition} in the queue.`,
  }); // All done.
});

queue.post('/leave', isQueueOpen, (req, res) => {
  // Handles leaving the queue.
  const {channel_id: channelId, user_id: userId} = req.twitch;

  const currentQueue = getQueue(channelId);

  // Lets do some checks to make sure were not doing anything bad.
  if (!userId) {
    res.status(401).send({
      message: 'You must share your identity to enter the queue.',
    });
    return;
  }
  // Make sure this person is actually in this queue.
  if (!currentQueue.contains(userId)) {
    res.status(500).send({
      message: 'You cannot leave a queue you\'re not in.',
    });
    return;
  }

  // Lets check to see if the person thats leaving is the current champion,
  // then remove them as champion.
  const champ = getChampion(channelId);
  if (champ && champ.user.userId == userId) {
    setChampion(channelId, null);
  }

  // Okay. lets remove them from the queue.
  currentQueue.remove(userId);

  res.send({
    message: 'You have been removed from the queue.',
  });
});

queue.post('/open', isBroadcaster, async (req, res) => {
  const {channel_id: channelId} = req.twitch;

  const queue = getQueue(channelId);
  queue.openQueue();

  const {content} = await getBroadcasterConfig(channelId);

  if ('watchdogSettings' in content) {
    const watchdogSettings = content.watchdogSettings;

    if (watchdogSettings.enableWatchdog) {
      const watchdog = getWatchdog(channelId);
      await watchdog.activate();
    }
  }
});

queue.post('/close', isBroadcaster, async (req, res) => {
  const {channel_id: channelId} = req.twitch;

  const queue = getQueue(channelId);
  queue.closeQueue();

  const watchdog = getWatchdog(channelId);

  if (watchdog.isActive()) {
    await watchdog.deactivate();
  }

  const matchup = getMatchup(channelId);

  setChampion(channelId, null);

  if (matchup) {
    setMatchup(channelId, null);
  }
});

module.exports = queue;

// Check if each queue has changed, then if it has publish it.
// TODO: we want to change this, so that instead of just sending out all
// ... queues, we look for all live channels, then send out their queues.
setInterval(async function() {
  const channelQueues = getAllQueues();
  for (const channelId in channelQueues) {
    if (Object.prototype.hasOwnProperty.call(channelQueues, channelId)) {
      const queue = channelQueues[channelId];

      if (queue.hasUpdated) {
        const message = {
          type: 'updateQueue',
          message: {
            queue: await queue.getAsArray(),
            isOpen: await queue.isOpen(),
          },
        };
        broadcast(channelId, message);
        queue.hasUpdated = false; // mark this so we don't update until a change
      }
    }
  }
}, queueUpdateIntervalMs);
