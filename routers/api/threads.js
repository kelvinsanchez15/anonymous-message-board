/* eslint-disable camelcase */
const express = require('express');
const Board = require('../../models/board');
const Thread = require('../../models/thread');

const router = express.Router({ mergeParams: true });

router
  .route('/threads/:board')

  // POST a thread to a specific message board with form data
  .post(async (req, res) => {
    const { board } = req.params;
    const thread = new Thread(req.body);

    try {
      await thread.save();

      // Find board by name and update pushing new issue (If no board is found create one using upsert)
      await Board.findOneAndUpdate(
        { name: board },
        { $push: { threads: thread } },
        { upsert: true, useFindAndModify: false }
      );

      return res.status(201).json(thread);
    } catch (err) {
      return res.status(400).send(err);
    }
  })

  // GET an array of the most recent 10 bumped threads on the board with only the most recent 3 replies
  .get(async (req, res) => {
    const { board } = req.params;

    const opts = {
      path: 'threads',
      select: '-reported -delete_password -__v',
      options: {
        limit: 10,
        sort: { bumped_on: 'desc' },
      },
      populate: {
        path: 'replies',
        select: '-reported -delete_password -__v',
        options: { limit: 3, sort: { created_on: 'desc' } },
      },
    };

    try {
      const foundBoard = await Board.findOne({ name: board })
        .populate(opts)
        .lean();

      if (!foundBoard)
        return res.status(404).json({ error: 'board not found' });

      return res.status(200).send(foundBoard.threads);
    } catch (err) {
      return res.status(500).send(err);
    }
  })

  // Report a thread and change it's reported value to true sending a PUT request
  .put(async (req, res) => {
    const { thread_id } = req.body;

    try {
      const thread = await Thread.findByIdAndUpdate(
        thread_id,
        {
          reported: true,
        },
        { useFindAndModify: false }
      );

      if (!thread) return res.status(404).json({ error: 'thread not found' });

      return res.status(200).send('success');
    } catch (err) {
      return res.status(500).send(err);
    }
  })

  // Delete a thread completely sending a DELETE request
  .delete(async (req, res) => {
    const { thread_id, delete_password } = req.body;

    try {
      const thread = await Thread.findById(thread_id);

      if (!thread) return res.status(404).json({ error: 'thread not found' });

      if (thread.delete_password !== delete_password)
        return res.status(401).send('incorrect password');

      await thread.remove();

      return res.status(200).send('success');
    } catch (err) {
      return res.status(500).send(err);
    }
  });

module.exports = router;
