const express = require('express');

const youtuberController = require('../controllers/youtuber');

const router = express.Router();

router.get('/home', youtuberController.getYoutuberHome);

module.exports = router;