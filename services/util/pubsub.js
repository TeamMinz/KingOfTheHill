const jwt = require('jsonwebtoken');

module.exports = function (ownerId, secret, clientId) {
    
    function buildChannelAuth(channelId) {
        const payload = {
            exp: Math.floor(Date.now() / 1000) + serverTokenDurationSec,
            channel_id: channelId,
            user_id: ownerId, 
            roles: 'external',
            pubsub_perms: {
                send: ['*'],
            },
        };

        return jwt.sign(payload, secret, {algorithm: 'HS256'});
    }

    function broadcastMessage(channelId, message) {
        const body = {
            content_type: 'application/json',
            message,
            targets: ['broadcast']
        };


        superagent.post(`https://api.twitch.tv/extensions/message/${channelId}`)
                  .set('Client-ID', clientId)
                  .set('Content-Type', 'application/json')
                  .set('Authorization', 'Bearer ' + buildChannelAuth(channelId))
                  .send(JSON.stringify(body))
                  .then(function (response) {
                    console.log("Successfully published broadcast for channel: " + channelId);
                  })
                  .catch(function (err) {
                    console.log("Error publishing broadcast for channel: " + channelId);
                    console.log(err);
                  });
    }
    
    //if this piece of code gets too many request, it will stack broadcast requests on the next timeslot, causing us to be rate limited.
    function scheduleBroadcast(channelId, message) {
        const now = Date.now();
        const cooldown = channelCooldowns[channelId];
        if (!cooldown || cooldown.time < now) {
            // It is.
            
            broadcastMessage(channelId, message);
            
            channelCooldowns[channelId] = {
                time: now + channelCooldownMs
            };
        } else if (!cooldown.trigger) {
            // It isn't; schedule a delayed broadcast if we haven't already done so.
            cooldown.trigger = setTimeout(broadcastMessage, now - cooldown.time, channelId);
        }
    }


    return {
        broadcast: scheduleBroadcast
    };
}