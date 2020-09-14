const {SECRET} = require('./options');
const jwt = require('jsonwebtoken');
// Create some middleware to help authorize the requests.

/**
 * @param {express.Request} req the request object passed from express.
 * @param {express.Response} res the response object passed by express.
 * @param {Function} next the next middleware function in the order.
 */
function authorizeHeader(req, res, next) {
  if (!req.headers.authorization) {
    // TODO sent appropriate response code.
    return;
  }

  const authstr = req.headers.authorization;
  const bearerPrefix = 'Bearer ';

  if (authstr.startsWith(bearerPrefix)) {
    const token = authstr.substring(bearerPrefix.length);

    jwt.verify(token, SECRET, function(err, payload) {
      if (err) {
        console.log(err);
        res.status(401).send('Failed to authorize JWT token.');
        return;
      }

      req.twitch = payload;

      next();
    });
  } else {
    res.status(401).send('Failed to authorize JWT token.');
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
    res.sendStatus(401);
  }
}

module.exports = {
  authorizeHeader,
  isBroadcaster,
};
