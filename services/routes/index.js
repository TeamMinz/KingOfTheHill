// eslint-disable-next-line new-cap
const router = require('express').Router();
const queue = require('./queue');
const matchup = require('./matchup');
const champion = require('./champion');
const config = require('./config');

router.use('/queue', queue);
router.use('/matchup', matchup);
router.use('/champion', champion);
router.use('/config', config);


router.get('/', (req, res) => res.send('Queue is alive!'));

module.exports = router;
