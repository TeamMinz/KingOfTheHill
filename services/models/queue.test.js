const {QueueModel} = require('./queue');

const testChannelId = 'test_channel';

test('Does the queue open and close?', async () => {
  const model = new QueueModel(testChannelId);

  await model.setOpen();
  expect(await model.isOpen()).toEqual(true);
  await model.setClosed();
  expect(await model.isOpen()).toEqual(false);
});

test('Can I enqueue and dequeue people from the queue?', async () => {
  const model = new QueueModel(testChannelId);

  const testChannelOne = {
    userId: 'Test_channel_one',
    opaqueUserId: 'Test_channel_one',
    displayName: 'Test_channel_one',
  };

  const testChannelTwo = {
    userId: 'Test_channel_two',
    opaqueUserId: 'Test_channel_two',
    displayName: 'Test_channel_two',
  };

  await model.setClosed();
  await model.setOpen();

  await model.push(testChannelOne);
  expect(await model.getValue()).toEqual([testChannelOne]);
  await model.push(testChannelTwo);
  expect(await model.getValue()).toEqual([testChannelOne, testChannelTwo]);
  const first = await model.shift();
  expect(first).toEqual(testChannelOne);
  expect(await model.getValue()).toEqual([testChannelTwo]);
  const second = await model.shift();
  expect(second).toEqual(testChannelTwo);
  expect(await model.getValue()).toEqual([]);

  await model.setClosed();
});

test('Can I remove a specific user from the queue?', async () => {
  const testChannelOne = {
    userId: 'Test_channel_one',
    opaqueUserId: 'Test_channel_one',
    displayName: 'Test_channel_one',
  };

  const testChannelTwo = {
    userId: 'Test_channel_two',
    opaqueUserId: 'Test_channel_two',
    displayName: 'Test_channel_two',
  };

  const testChannelThree = {
    userId: 'Test_channel_three',
    opaqueUserId: 'Test_channel_three',
    displayName: 'Test_channel_three',
  };

  const queue = new QueueModel(testChannelId);

  await queue.setClosed();
  await queue.setOpen();

  await queue.push(testChannelOne);
  await queue.push(testChannelTwo);
  await queue.push(testChannelThree);

  expect(await queue.getValue()).toEqual([testChannelOne, testChannelTwo, testChannelThree]);

  const resp = await queue.remove(testChannelTwo.userId);

  expect(resp).toEqual(testChannelTwo);
  expect(await queue.getValue()).toEqual([testChannelOne, testChannelThree]);

  const respTwo = await queue.remove('SomeIDNOTinthequeue');

  expect(respTwo).toEqual(null);
  expect(await queue.getValue()).toEqual([testChannelOne, testChannelThree]);

  await queue.setClosed();
});

test('Can I insert a user into a specific position in the queue?', async () => {
  const testChannelOne = {
    userId: 'Test_channel_one',
    opaqueUserId: 'Test_channel_one',
    displayName: 'Test_channel_one',
  };

  const testChannelTwo = {
    userId: 'Test_channel_two',
    opaqueUserId: 'Test_channel_two',
    displayName: 'Test_channel_two',
  };

  const testChannelThree = {
    userId: 'Test_channel_three',
    opaqueUserId: 'Test_channel_three',
    displayName: 'Test_channel_three',
  };

  const testChannelFour = {
    userId: 'Test_channel_four',
    opaqueUserId: 'Test_channel_four',
    displayName: 'Test_channel_four',
  };

  const queue = new QueueModel(testChannelId);
  await queue.setClosed();
  await queue.setOpen();

  await queue.push(testChannelOne);
  await queue.push(testChannelTwo);
  await queue.push(testChannelThree);

  // Some happy path testing.

  await queue.insertAt(testChannelFour, 0);

  expect(await queue.getValue()).toEqual([testChannelFour, testChannelOne, testChannelTwo, testChannelThree]);

  await queue.remove(testChannelFour.userId);

  await queue.insertAt(testChannelFour, 1);

  expect(await queue.getValue()).toEqual([testChannelOne, testChannelFour, testChannelTwo, testChannelThree]);

  await queue.remove(testChannelFour.userId);

  // Some not so happy path testing.

  await queue.insertAt(testChannelFour, 6);

  expect(await queue.getValue()).toEqual([testChannelOne, testChannelTwo, testChannelThree, testChannelFour]);

  await queue.remove(testChannelFour.userId);

  await queue.insertAt(testChannelFour, -1);

  expect(await queue.getValue()).toEqual([testChannelOne, testChannelTwo, testChannelThree]);

  await queue.setClosed();
});
