const {describe} = require('yargs');
const LeaderboardModel = require('./leaderboard');
const testChannelId = 'test_channel';

beforeEach(async () => {
  const model = new LeaderboardModel(testChannelId);
  await model.clear();
});

test('Can I add an entry to the leaderboard?', async () => {
  const model = new LeaderboardModel(testChannelId);

  const testEntryOne = {
    userId: 'test_entry_one',
    score: 10,
    displayName: 'Test Leaderboard Entry',
  };

  await model.addLeaderboardEntry(testEntryOne);

  expect(await model.getValue()).toEqual([testEntryOne]);
});

test('Can I clear the leaderboard?', async () => {
  const model = new LeaderboardModel(testChannelId);

  const testEntryOne = {
    userId: 'test_entry_one',
    score: 1000,
    displayName: 'Test Entry One',
  };

  const testEntryTwo = {
    userId: 'test_entry_two',
    score: 110,
    displayName: 'Test Entry Two',
  };

  const testEntryThree = {
    userId: 'test_entry_three',
    score: 10,
    displayName: 'Test Entry Three',
  };

  await model.addLeaderboardEntry(testEntryThree);
  await model.addLeaderboardEntry(testEntryOne);
  await model.addLeaderboardEntry(testEntryTwo);

  expect(await model.getValue()).toEqual([testEntryOne, testEntryTwo, testEntryThree]);

  await model.clear();

  expect(await model.getValue()).toEqual([]);
});

test('Can I change the max size of the leaderboard?', async () => {
  const model = new LeaderboardModel(testChannelId);

  expect(await model.getMaxSize()).toEqual(10); // Should be default.

  await model.setMaxSize(100);

  expect(await model.getMaxSize()).toEqual(100);

  await model.setMaxSize(10000); // We shouldn't be able to go above 100.

  expect(await model.getMaxSize()).toEqual(100);
});

test('Can I get the minimum win threshold?', async () => {
  const model = new LeaderboardModel(testChannelId);

  expect(await model.getLeaderboardThreshold()).toEqual(0);

  await model.setMaxSize(3);

  const testEntryOne = {
    userId: 'test_entry_one',
    score: 1000,
    displayName: 'Test Entry One',
  };

  const testEntryTwo = {
    userId: 'test_entry_two',
    score: 110,
    displayName: 'Test Entry Two',
  };

  const testEntryThree = {
    userId: 'test_entry_three',
    score: 10,
    displayName: 'Test Entry Three',
  };

  await model.addLeaderboardEntry(testEntryThree);
  await model.addLeaderboardEntry(testEntryTwo);
  await model.addLeaderboardEntry(testEntryOne);

  expect(await model.getValue()).toEqual([testEntryOne, testEntryTwo, testEntryThree]);

  expect(await model.getLeaderboardThreshold()).toEqual(testEntryThree.score);
});

test('Does adding an entry below the threshold fail?', async () => {
  const model = new LeaderboardModel(testChannelId);

  expect(await model.getLeaderboardThreshold()).toEqual(0);

  await model.setMaxSize(3);

  const testEntryOne = {
    userId: 'test_entry_one',
    score: 1000,
    displayName: 'Test Entry One',
  };

  const testEntryTwo = {
    userId: 'test_entry_two',
    score: 110,
    displayName: 'Test Entry Two',
  };

  const testEntryThree = {
    userId: 'test_entry_three',
    score: 10,
    displayName: 'Test Entry Three',
  };

  const testEntryFour = {
    userId: 'test_entry_four',
    score: 5,
    displayName: 'Test Entry Four',
  };

  await model.addLeaderboardEntry(testEntryThree);
  await model.addLeaderboardEntry(testEntryTwo);
  await model.addLeaderboardEntry(testEntryOne);

  expect(await model.getValue()).toEqual([testEntryOne, testEntryTwo, testEntryThree]);
  expect(await model.getLeaderboardThreshold()).toEqual(testEntryThree.score);

  await model.addLeaderboardEntry(testEntryFour);

  expect(await model.getValue()).toEqual([testEntryOne, testEntryTwo, testEntryThree]);
});
