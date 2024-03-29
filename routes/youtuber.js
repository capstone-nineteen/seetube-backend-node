const express = require('express');

const youtuberController = require('../controllers/youtuber');

const router = express.Router();

const { body } = require('express-validator');

const isAuth = require('../middleware/is-auth');

router.put('/email',

  body('email')
  .isEmail()
  .normalizeEmail(), youtuberController.emailAuth);

router.post('/signup',
[
    body('password')
      .trim()
      .isLength({ min: 10 }),
    body('name')
      .trim()
      .isLength({ min: 2 })
] ,youtuberController.signup);

router.post('/login', youtuberController.login);

router.get('/home', isAuth, youtuberController.getYoutuberHome);

router.get('/focus/:videoId', isAuth, youtuberController.getFocus);

router.get('/emotion/:videoId', isAuth, youtuberController.getEmotion);

router.get('/sceneStealer/:videoId', isAuth, youtuberController.getSceneStealer);

router.get('/shorts/:videoId', isAuth, youtuberController.getShorts);

router.get('/highlight/:videoId', isAuth, youtuberController.getHighlight);

module.exports = router;