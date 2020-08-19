// eslint-disable-next-line new-cap
const router = require('express').Router();
const queue = require('./queue');
const matchup = require('./matchup');

router.use('/queue', queue);
router.use('/matchup', matchup);

router.get('/', (req, res) => res.send('Queue is alive!'));

module.exports = router;
