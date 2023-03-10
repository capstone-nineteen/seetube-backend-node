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

module.exports = router;