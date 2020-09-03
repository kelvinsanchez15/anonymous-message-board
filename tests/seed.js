const Board = require('../models/board');
const Thread = require('../models/thread');
const Reply = require('../models/reply');

const dummyThreads = [
  { text: 'thread1', delete_password: 'password1' },
  { text: 'thread2', delete_password: 'password2' },
  { text: 'thread3', delete_password: 'password3' },
  { text: 'thread4', delete_password: 'password4' },
  { text: 'thread5', delete_password: 'password5' },
  { text: 'thread6', delete_password: 'password6' },
  { text: 'thread7', delete_password: 'password7' },
  { text: 'thread8', delete_password: 'password8' },
  { text: 'thread9', delete_password: 'password9' },
  { text: 'thread10', delete_password: 'password10' },
  { text: 'thread11', delete_password: 'password11' },
];

const dummyReplies = [
  { text: 'reply1', delete_password: 'password1' },
  { text: 'reply2', delete_password: 'password2' },
  { text: 'reply3', delete_password: 'password3' },
  { text: 'reply4', delete_password: 'password4' },
  { text: 'reply5', delete_password: 'password5' },
];

const seedDB = async () => {
  await Board.deleteMany();
  await Thread.deleteMany();
  await Reply.deleteMany();

  const threads = await Thread.create(dummyThreads);

  await Board.findOneAndUpdate(
    { name: 'mockboard' },
    { $push: { threads } },
    { upsert: true, useFindAndModify: false }
  );

  const replies = await Reply.create(dummyReplies);

  await Thread.findOneAndUpdate(
    { text: 'thread5' },
    { $push: { replies } },
    { useFindAndModify: false }
  );
};

module.exports = seedDB;
