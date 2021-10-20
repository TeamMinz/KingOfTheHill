const LeaderboardModel = require('./leaderboard');
const testChannelId = 'test_channel';

beforeEach(async () => {
  const model = new LeaderboardModel(testChannelId);
  await model.delete();
});

test('Can I set / get the value of the leaderboard?', async () => {
  const model = new LeaderboardModel(testChannelId);

  const testEntryOne = {
    userId: 'test_entry_one',
    score: 10,
    displayName: 'Test Leaderboard Entry',
  };

  const testValue = [
    testEntryOne
  ];

  await model.setValue(testValue);

  expect(await model.getValue()).toEqual(testValue);
});

test('Can I change the max size of the leaderboard?', async () => {
  const model = new LeaderboardModel(testChannelId);

  expect(await model.getMaxSize()).toEqual(10); // Should be default.

  await model.setMaxSize(100);

  expect(await model.getMaxSize()).toEqual(100);

  await model.setMaxSize(10000); // We shouldn't be able to go above 100.

  expect(await model.getMaxSize()).toEqual(100);
});
