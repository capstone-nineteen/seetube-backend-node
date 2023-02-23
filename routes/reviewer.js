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


//리뷰어 홈
router.get('/home', reviewerController.getReviewerHome);

//전체 영상목록
router.get('/videos/all', reviewerController.getVideos);

//카테고리별 영상목록
router.get('/videos/category/:categoryName', reviewerController.getVideosByCategory);

//검색결과 영상목록
router.get('/videos/search', reviewerController.searchVideos);

//영상 상세화면
router.get('/video/:videoId', videoController.getVideo);

//마이페이지
router.get('/mypage', reviewerController.getMyPage);

//환급페이지
router.get('/coin', reviewerController.getReviewerCoin);

router.post('/withdraw', 
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



router.post('/watchingInfo', reviewerController.postWatchingInfos);

module.exports = router;