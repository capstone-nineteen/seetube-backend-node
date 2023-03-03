const Video = require('../models/video');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const Review = require('../models/review');


//영상 상세화면
exports.getVideo = (req, res, next) => {

    const reviewerId = req.userId;
    const videoId = req.params.videoId;
    
    const videoObject = {};
    

    Video.findOne({
        where:{id: videoId},
        attributes:['id','videoTitle', 'creator', 'category', 'videoCoin', 'reviewCurrent', 'reviewGoal', 'createdAt', 'reviewDate', 'videoDetail', 'imagePath', 'videoPath'],

    })
      .then(video => {
        if (!video) {
            const error = new Error('could not find video.');
            error.statusCode = 404;
            throw error;
        }
        videoObject.id = video.id;
        videoObject.videoTitle = video.videoTitle;
        videoObject.creator = video.creator;
        videoObject.category = video.category;
        videoObject.videoCoin = video.videoCoin;
        videoObject.reviewCurrent = video.reviewCurrent;
        videoObject.reviewGoal = video.reviewGoal;
        videoObject.createdAt = video.createdAt;
        videoObject.reviewDate = video.reviewDate;
        videoObject.videoDetail = video.videoDetail;
        videoObject.imagePath = video.imagePath;
        videoObject.videoPath = video.videoPath;

        return Review.findOne({
          where:{reviewerId: reviewerId,
                videoId: videoId}
        })
        

      })
      .then(review => {
        if (!review) {
          videoObject.isReviewerReviewed = false;
        } else {
          videoObject.isReviewerReviewed = true;
        }
        res.status(200).json({video: videoObject});
      })
      .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
      });
};

