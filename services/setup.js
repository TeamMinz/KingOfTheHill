const {cleanupRedis} = require('./util/database');

afterAll(() => {
  cleanupRedis();
});
