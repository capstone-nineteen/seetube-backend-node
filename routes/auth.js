const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

const { body } = require('express-validator');

const Reviewer = require('../models/reviewer');

router.put('/email/reviewer',

  body('email')
  .isEmail()
  .normalizeEmail(), authController.emailAuth);

router.post('/signup/reviewer',
[
    body('password')
      .trim()
      .isLength({ min: 10 }),
    body('name')
      .trim()
      .isLength({ min: 2 })
] ,authController.signup);

router.post('/login/reviewer', authController.login);




module.exports = router;