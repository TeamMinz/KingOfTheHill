const {cleanupRedis} = require('./models/queue');

afterAll(() => {
  cleanupRedis();
});
