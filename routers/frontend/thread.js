const express = require('express');
const fetch = require('node-fetch');
const moment = require('moment');

const router = express.Router({ mergeParams: true });

router
  .route('/:board/:id')

  .post(async (req, res) => {
    const { board } = req.params;
    const { host } = req.headers;

    try {
      const response = await fetch(`http://${host}/api/replies/${board}`, {
        method: 'post',
        body: JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json' },
      });

      const reply = await response.json();

      if (reply.errors) {
        req.flash('error', reply.message);
      } else {
        req.flash('success', 'Your reply has been created successfully');
      }

      res.redirect(req.body.thread_id);
    } catch (err) {
      res.status(500).send(err);
    }
  })

  .get(async (req, res) => {
    const { board, id } = req.params;
    const { host } = req.headers;
    const url = `http://${host}/api/replies/${board}?thread_id=${id}`;

    try {
      const response = await fetch(url);

      const thread = await response.json();

      // Set relative time
      thread.created_on = moment(thread.created_on).fromNow();

      thread.replies.forEach((elem) => {
        const reply = elem;
        reply.created_on = moment(reply.created_on).fromNow();
      });

      res.render('thread', { board, thread });
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

      const textResponse = await response.text();

      if (textResponse === 'success') {
        req.flash('success', 'Your report has been submitted successfully');
      } else {
        req.flash('error', 'Upps! An error');
      }

      res.redirect(req.body.thread_id);
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
        res.redirect(`/b/${board}`);
      } else {
        req.flash('error', 'The password is incorrect. Try again.');
        res.redirect(req.body.thread_id);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

router.put('/:board/:id/report', async (req, res) => {
  const { board } = req.params;
  const { host } = req.headers;

  try {
    const response = await fetch(`http://${host}/api/replies/${board}`, {
      method: 'put',
      body: JSON.stringify(req.body),
      headers: { 'Content-Type': 'application/json' },
    });

    const textResponse = await response.text();

    if (textResponse === 'success') {
      req.flash('success', 'Your report has been submitted successfully');
    } else {
      req.flash('error', 'Upps! There was an error');
    }

    res.redirect(`/b/${board}/${req.body.thread_id}`);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/:board/:id/delete', async (req, res) => {
  const { board } = req.params;
  const { host } = req.headers;

  try {
    const response = await fetch(`http://${host}/api/replies/${board}`, {
      method: 'delete',
      body: JSON.stringify(req.body),
      headers: { 'Content-Type': 'application/json' },
    });

    const textResponse = await response.text();

    if (textResponse === 'success') {
      req.flash('success', 'The reply has been deleted successfully.');
    } else {
      req.flash('error', 'The password is incorrect. Try again.');
    }

    res.redirect(`/b/${board}/${req.body.thread_id}`);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
