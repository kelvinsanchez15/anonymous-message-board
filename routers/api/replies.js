/* eslint-disable camelcase */
const express = require('express');
const Thread = require('../../models/thread');
const Reply = require('../../models/reply');

const router = express.Router({ mergeParams: true });

router
  .route('/replies/:board')

  // POST a reply to a thread on a specific board
  .post(async (req, res) => {
    const { text, delete_password, thread_id } = req.body;
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
  })

  // GET an entire thread with all it's replies
  .get(async (req, res) => {
    const { thread_id } = req.query;

    const opts = {
      path: 'replies',
      select: '-reported -delete_password -__v',
    };

    try {
      const thread = await Thread.findById(thread_id)
        .select('-reported -delete_password -__v')
        .populate(opts)
        .lean();

      if (!thread) return res.status(404).json({ error: 'thread not found' });

      return res.status(200).send(thread);
    } catch (err) {
      return res.status(500).send(err);
    }
  })

  // Report a reply and change it's reported value to true sending a PUT request
  .put(async (req, res) => {
    const { reply_id } = req.body;

    try {
      const reply = await Reply.findByIdAndUpdate(
        reply_id,
        {
          reported: true,
        },
        { useFindAndModify: false }
      );

      if (!reply) return res.status(404).json({ error: 'reply not found' });

      return res.status(200).send('success');
    } catch (err) {
      return res.status(500).send(err);
    }
  })

  // Delete a reply (just changing the text to '[deleted]') sending a DELETE request
  .delete(async (req, res) => {
    const { reply_id, delete_password } = req.body;

    try {
      const reply = await Reply.findById(reply_id);

      if (!reply) return res.status(404).json({ error: 'reply not found' });

      if (reply.delete_password !== delete_password)
        return res.status(401).send('incorrect password');

      await reply.updateOne({ text: '[deleted]' }, { useFindAndModify: false });

      return res.status(200).send('success');
    } catch (err) {
      return res.status(500).send(err);
    }
  });

module.exports = router;
