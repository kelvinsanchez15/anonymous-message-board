const express = require('express');
const fetch = require('node-fetch');

const router = express.Router({ mergeParams: true });

router
  .route('/:board')

  .post(async (req, res) => {
    const { board } = req.params;

    const response = await fetch(`http://localhost:3000/api/threads/${board}`, {
      method: 'post',
      body: JSON.stringify(req.body),
      headers: { 'Content-Type': 'application/json' },
    });

    await response.json();

    res.redirect(board);
  })

  .get(async (req, res) => {
    const { board } = req.params;

    const response = await fetch(`http://localhost:3000/api/threads/${board}`);

    const threads = await response.json();

    res.render('board', { board, threads });
  })

  .put(async (req, res) => {
    const { board } = req.params;

    const response = await fetch(`http://localhost:3000/api/threads/${board}`, {
      method: 'put',
      body: JSON.stringify(req.body),
      headers: { 'Content-Type': 'application/json' },
    });

    const textResponse = await response.text();

    res.send(textResponse);
  })

  .delete(async (req, res) => {
    const { board } = req.params;

    const response = await fetch(`http://localhost:3000/api/threads/${board}`, {
      method: 'delete',
      body: JSON.stringify(req.body),
      headers: { 'Content-Type': 'application/json' },
    });

    const textResponse = await response.text();

    res.send(textResponse);
  });

module.exports = router;
