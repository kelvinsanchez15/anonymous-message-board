/* eslint-disable camelcase */
const express = require('express');
const Board = require('../../models/board');
const Thread = require('../../models/thread');
const Reply = require('../../models/reply');

const router = express.Router({ mergeParams: true });

router.route('/replies/:board').post(async (req, res) => {
  const { text, delete_password, thread_id } = req.query;
  const reply = new Reply({ text, delete_password });

  try {
    const thread = await Thread.findById(thread_id);

    if (!thread) return res.status(404).json({ error: 'thread not found' });

    await reply.save();

    await thread.updateOne(
      { $push: { replies: reply } },
      { useFindAndModify: false }
    );

    return res.status(201).json(reply);
  } catch (err) {
    return res.status(400).send(err);
  }
});

module.exports = router;
