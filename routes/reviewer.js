const express = require('express');

const reviewerController = require('../controllers/reviewer');
const videoController = require('../controllers/videos');

const router = express.Router();

const { body } = require('express-validator');

const isAuth = require('../middleware/is-auth');

router.put('/email',

  body('email')
  .isEmail()
  .normalizeEmail(), reviewerController.emailAuth);


router.post('/signup',
[
    body('password')
      .trim()
      .isLength({ min: 10 }),
    body('name')
      .trim()
      .isLength({ min: 2 })
] ,reviewerController.signup);

router.post('/login', reviewerController.login);

//리뷰어 홈
router.get('/home', isAuth, reviewerController.getReviewerHome);

//전체 영상목록
router.get('/videos/all', isAuth, reviewerController.getVideos);

//카테고리별 영상목록
router.get('/videos/category/:categoryName', isAuth, reviewerController.getVideosByCategory);

//검색결과 영상목록
router.get('/videos/search', isAuth, reviewerController.searchVideos);

//영상 상세화면
router.get('/video/:videoId', videoController.getVideo);

//마이페이지
router.get('/mypage', isAuth, reviewerController.getMyPage);

//환급페이지
router.get('/coin', isAuth, reviewerController.getReviewerCoin);

router.post('/withdraw', isAuth,
  [
    body('bankName')
      .trim()
      .isLength({ min: 2 }),
    body('accountHolder')
      .trim()
        .isLength({ min: 2 }),
    body('accountNumber')
      .trim()
        .isLength({min: 10, max:20})
    
  ],
  reviewerController.postWithdraw

);



router.post('/watchingInfo', isAuth, reviewerController.postWatchingInfos);

module.exports = router;