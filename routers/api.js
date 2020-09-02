const express = require('express');

const router = express.Router({ mergeParams: true });

router.route('/threads/:board');

router.route('/replies/:board');

module.exports = router;
