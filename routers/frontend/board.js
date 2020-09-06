const express = require('express');
const fetch = require('node-fetch');
const moment = require('moment');

const router = express.Router({ mergeParams: true });

router
  .route('/:board')

  .post(async (req, res) => {
    const { board } = req.params;
    const { host } = req.headers;

    try {
      const response = await fetch(`http://${host}/api/threads/${board}`, {
        method: 'post',
        body: JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json' },
      });

      const thread = await response.json();

      if (thread.errors) {
        req.flash('error', thread.message);
      } else {
        req.flash('success', 'Your thread has been created successfully');
      }

      res.redirect(board);
    } catch (err) {
      res.status(500).send(err);
    }
  })

  .get(async (req, res) => {
    const { board } = req.params;
    const { host } = req.headers;

    try {
      const response = await fetch(`http://${host}/api/threads/${board}`);

      const threads = await response.json();

      // Set relative time
      if (!threads.error) {
        threads.forEach((elem1) => {
          const thread = elem1;
          thread.created_on = moment(thread.created_on).fromNow();
          thread.replies.forEach((elem2) => {
            const reply = elem2;
            reply.created_on = moment(reply.created_on).fromNow();
          });
        });
      }

      res.render('board', { board, threads });
    } catch (err) {
      res.status(500).send(err);
    }
  })

  .put(async (req, res) => {
    const { board } = req.params;
    const { host } = req.headers;

    try {
      const response = await fetch(`http://${host}/api/threads/${board}`, {
        method: 'put',
        body: JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json' },
      });

      await response.text();

      req.flash('success', 'Your report has been submitted successfully');

      res.redirect(board);
    } catch (err) {
      res.status(500).send(err);
    }
  })

  .delete(async (req, res) => {
    const { board } = req.params;
    const { host } = req.headers;

    try {
      const response = await fetch(`http://${host}/api/threads/${board}`, {
        method: 'delete',
        body: JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json' },
      });

      const textResponse = await response.text();

      if (textResponse === 'success') {
        req.flash('success', 'The thread has been deleted successfully.');
      } else {
        req.flash('error', 'The password is incorrect. Try again.');
      }

      res.redirect(board);
    } catch (err) {
      res.status(500).send(err);
    }
  });

module.exports = router;
