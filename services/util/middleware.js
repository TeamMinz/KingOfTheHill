const {StatusCodes} = require('http-status-codes');
const {SECRET} = require('./options');
const jwt = require('jsonwebtoken');
const express = require('express');
const {getQueue} = require('../controller/queue');
// Create some middleware to help authorize the requests.

/**
 * @param {express.Request} req the request object passed from express.
 * @param {express.Response} res the response object passed by express.
 * @param {Function} next the next middleware function in the order.
 */
function authorizeHeader(req, res, next) {
  if (!req.headers.authorization) {
    res.status(StatusCodes.UNAUTHORIZED).send('No JWT sent with request.');
    return;
  }

  const authstr = req.headers.authorization;
  const bearerPrefix = 'Bearer ';

  if (authstr.startsWith(bearerPrefix)) {
    const token = authstr.substring(bearerPrefix.length);

    jwt.verify(token, SECRET, function(err, payload) {
      if (err) {
        console.log(err);
        res.status(StatusCodes.UNAUTHORIZED).send('Failed to authorize JWT token.');
        return;
      }

      req.twitch = payload;

      next();
    });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).send('Failed to authorize JWT token.');
    return;
  }
}

/**
 * Rejects requests from people not the broadcaster.
 *
 * @param {express.Request} req request object
 * @param {express.Response} res response object
 * @param {Function} next next handler
 */
function isBroadcaster(req, res, next) {
  if (req.twitch.role == 'broadcaster') {
    next();
  } else {
    res.sendStatus(StatusCodes.FORBIDDEN);
  }
}
/**
 * Middleware, ensures queue is open.
 *
 * @param {express.Request} req request
 * @param {express.Response} res response
 * @param {express.NextFunction} next next function
 */
async function isQueueOpen(req, res, next) {
  const {channel_id: channelId} = req.twitch;
  const currentQueue = getQueue(channelId);

  if (!(await currentQueue.isOpen())) {
    res.sendStatus(StatusCodes.NOT_ALLOWED);
    return;
  }

  next();
}

module.exports = {
  authorizeHeader,
  isBroadcaster,
  isQueueOpen,
};
