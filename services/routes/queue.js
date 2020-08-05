const express = require('express');
const superagent = require('superagent');
const router = express.Router();

module.exports = function (ownerId, secret, clientId) {
    const channelCooldownMs = 1000;
    const channelCooldowns = {};
    const channelQueues = {};

    router.post('/join', function (req, res) { //Handles joining the queue.
        const {
            channel_id: channelId,
            opaque_user_id: opaqueUserId
        } = req.twitch;

        const currentQueue = channelQueues[channelId] || [];

        //If the user is not signed into twitch, they cannot join the queue.
        if (opaqueUserId.startsWith("A")) {
            res.status(401).send({
                message: "You must sign in to join the queue."
            });
        }

        pubsub.broadcast(channelId, currentQueue);

        res.send({
            message: `You are now #${currentQueue.length} in the queue.`
        });
    });

    router.post('/leave', function (req, res) { //Handles leaving the queue.
        const {
            channel_id: channelId,
            opaque_user_id: opaqueUserId
        } = req.twitch;

        const currentQueue = channelQueues[channelId];

        if (!currentQueue) {
            res.status(500).send({
                message: "Something went wrong. Please try again later."
            });
            return;
        }

        currentQueue.filter(function (qmember) {
            return qmember != opaqueUserId;
        });

        pubsub.broadcast(channelId, currentQueue);

        res.send({
            message: "You have been removed from the queue."
        });
    });

    return router;
};