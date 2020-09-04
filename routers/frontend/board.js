const express = require('express');
const fetch = require('node-fetch');

const router = express.Router({ mergeParams: true });

router
  .route('/:board')

  .get(async (req, res) => {
    const { board } = req.params;

    const response = await fetch(`http://localhost:3000/api/threads/${board}`);

    const threads = await response.json();

    res.render('board', { board, threads });
  });

module.exports = router;
