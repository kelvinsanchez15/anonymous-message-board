/* eslint-disable camelcase */
const express = require('express');
const Board = require('../../models/board');
const Thread = require('../../models/thread');
const Reply = require('../../models/reply');

const router = express.Router({ mergeParams: true });

router.route('/threads/:board').post(async (req, res) => {
  const { board } = req.params;
  const thread = new Thread(req.query);

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
});

module.exports = router;
