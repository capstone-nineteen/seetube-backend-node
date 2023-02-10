const Youtuber = require('../models/youtuber');
const Video = require('../models/video');
const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const mysql = require('mysql2');

//유튜버 홈
exports.getYoutuberHome = (req, res, next) => {

    req.params.youtuberId = 1;
    const youtuberId = req.params.youtuberId;

    const youtuberHome = [];


    Youtuber.findOne({
        where:{id: youtuberId},
        attributes: ['youtuberName']
    })
        .then(youtuber => {
            youtuberHome[0] = youtuber.youtuberName;

            return Video.findAll({
                where:{youtuberId: youtuberId,
                        isReviewed: true},
    
                attributes:['videoTitle', 'creator', 'videoCoin', 'reviewCurrent', 'reviewGoal', 'createdAt', 'reviewDate', 'videoDetail', 'imagePath']
            })
        })
        .then(finishedReviews => {
            youtuberHome[1] = finishedReviews;

            return Video.findAll({
                where:{youtuberId: youtuberId,
                        isReviewed: false},
    
                attributes:['videoTitle', 'creator', 'videoCoin', 'reviewCurrent', 'reviewGoal', 'createdAt', 'reviewDate', 'videoDetail', 'imagePath']
            
             })
        })
        .then(reviewsInProgress => {
            youtuberHome[2] = reviewsInProgress;

            res.status(200).json({userName: youtuberHome[0], finishedReviews: youtuberHome[1], reviewsInProgress: youtuberHome[2]});
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });
    
};
