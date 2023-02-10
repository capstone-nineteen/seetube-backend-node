const Video = require('../models/video');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const Reviewer = require('../models/reviewer');


//영상 상세화면
exports.getVideo = (req, res, next) => {
    const videoId = req.params.videoId;
    Video.findOne({
        where:{id: videoId},
        attributes:['videoTitle', 'creator', 'videoCoin', 'reviewCurrent', 'reviewGoal', 'createdAt', 'reviewDate', 'videoDetail', 'imagePath', 'videoPath']
    })
      .then(video => {
        if (!video) {
            const error = new Error('could not find video.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({video: video});

      })
      .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
      });
};

