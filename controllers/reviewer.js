const Reviewer = require('../models/reviewer');
const Review = require('../models/review');
const Withdraw = require('../models/withdraw');
const Video = require('../models/video');

const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { post } = require('../routes/auth');

//리뷰어 홈
exports.getReviewerHome = (req, res, next) => {
    
    
    req.params.reviwerId = 1;
    const reviewerId = req.params.reviewerId;

    const reviewerHome = [];
    const videos = [];
    const section_new = {};
    const section_trip = {};
    const section_daily = {};
    const section_entertain = {};

    Reviewer.findOne({
        where:{id:reviewerId},
        attributes:['reviewerName', 'reviewerCoin']
    })
    .then(reviewer => {
        reviewerHome[0] = reviewer.reviewerName;
        reviewerHome[1] = reviewer.reviewerCoin;
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });


    Video.findAll({
        order: [['createdAt', 'DESC']],
        attributes: ['videoTitle', 'creator', 'videoCoin', 'reviewCurrent', 'reviewGoal', 'createdAt', 'reviewDate', 'videoDetail', 'imagePath'],
        limit:3
    })
        .then(newVideos => {
            section_new.title = '새로운 영상';
            section_new.videos = newVideos;
            videos[0] = section_new;
            console.log(newVideos);
            return Video.findAll({
                where: { category: '여행'},
                attributes: ['videoTitle', 'creator', 'videoCoin', 'reviewCurrent', 'reviewGoal', 'createdAt', 'reviewDate', 'videoDetail', 'imagePath'],
                limit:3
            });
        })
        .then(tripVideos => {
            section_trip.title = '여행';
            section_trip.videos = tripVideos;
            videos[1] = section_trip;
            return Video.findAll({
                where: { category: '일상'},
                attributes: ['videoTitle', 'creator', 'videoCoin', 'reviewCurrent', 'reviewGoal', 'createdAt', 'reviewDate', 'videoDetail', 'imagePath'],
                limit:3
            });
        })
        .then(dailyVideos => {
            section_daily.title = '일상';
            section_daily.videos = dailyVideos;
            videos[2] = section_daily;
            return Video.findAll({
                where: { category:'엔터테인먼트'},
                attributes: ['videoTitle', 'creator', 'videoCoin', 'reviewCurrent', 'reviewGoal', 'createdAt', 'reviewDate', 'videoDetail', 'imagePath'],
                limit:3
            });
        })
        .then(entertainVideos => {
            section_entertain.title = '엔터테인먼트';
            section_entertain.videos = entertainVideos;
            videos[3] = section_entertain;
            reviewerHome[2] = videos;
            res.status(200).json({userName: reviewerHome[0], coin: reviewerHome[1], sections: reviewerHome[2]})
            
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });

    
    
};

//전체 영상목록
exports.getVideos = (req, res, next) => {
    Video.findAll({
        order: [['createdAt', 'DESC']],
        attributes: ['videoTitle', 'creator', 'videoCoin', 'reviewCurrent', 'reviewGoal', 'createdAt', 'reviewDate', 'videoDetail', 'imagePath']
    })
        .then(videos => {
            res
                .status(200)
                .json({videos: videos});
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
    });
};

//카테고리별 영상목록
exports.getVideosByCategory = (req, res, next) => {
    const categoryName = req.params.categoryName;
    Video.findAll({
       where: {category: categoryName},
       order: [['createdAt', 'DESC']],
       attributes: ['videoTitle', 'creator', 'videoCoin', 'reviewCurrent', 'reviewGoal', 'createdAt', 'reviewDate', 'videoDetail', 'imagePath']
    })
        .then(videos => {
        res
            .status(200)
            .json({videos: videos});
         })
        .catch(err => {
            if(!err.statusCode){
             err.statusCode = 500;
        }
        next(err);
    });
};

//검색 결과 영상목록
exports.searchVideos = (req, res, next) => {
    let keyword = req.query.keyword;
    
    //trim으로 앞뒤 공백 제거
    keyword = keyword.trim();

    //키워드에 공백만 존재
    if (!keyword.length){
        return res.stsatus(400).json('invalid target');
    }

    //키워드 사이에 공백이 2개 이상 존재 > 하나의 공백으로 변환
    keyword = keyword.replace(/\s\s+/gi, ' ');
    
    Video.findAll({
        where: {
            [Op.or]: [
                { videoTitle: { [Op.like]: '%' + keyword + '%'} },
                { creator: { [Op.like]: '%' + keyword + '%'}}
            ]
         },
        order: [['createdAt', 'DESC']],
        attributes: ['videoTitle', 'creator', 'videoCoin', 'reviewCurrent', 'reviewGoal', 'createdAt', 'reviewDate', 'videoDetail', 'imagePath']
    })
        .then(videos => {
        res
            .status(200)
            .json({videos: videos});
        })
        .catch(err => {
            if(!err.statusCode){
             err.statusCode = 500;
        }
        next(err);

        })
};

//마이페이지
exports.getMyPage = (req, res, next) => {

    const myPage = [];
    const reviewHistory = {};
    const reviewerId = 1;
    Reviewer.findOne({
        where: {id: reviewerId},
        attributes: ['reviewerName', 'reviewerCoin']
    }).then(reviewer => {
        myPage[0] = reviewer.reviewerName;
        myPage[1] = reviewer.reviewerCoin;
        return Review.findAll({
            where:{reviewerId: reviewerId},
            attributes: ['reviewDate'],
            include:{
                model:Video,
                attributes: ['videoTitle', 'videoCoin']
            }
        }); 
    })
    .then(reviews => {
        

        myPage[2] = reviews;

        return Withdraw.findAll({
            where:{reviewerId:reviewerId},
            attributes: ['withdrawCoin', 'withdrawDate']
        });

    })
    .then(withdraws => {
        myPage[3] = withdraws;
        res.status(200).json({name: myPage[0], coin: myPage[1], reviewHistories: myPage[2], withdrawHistories:myPage[3]})
    })
};

//환급신청화면
exports.getReviewerCoin = (req, res, next) => {
    
    req.params.reviewerId = 1;
    const reviewerId = req.params.reviewerId;

    Reviewer.findOne({
        where: {id: reviewerId},
        attributes: ['reviewerCoin']
    }).then(reviewerCoin => {
        res.status(200).json({reviewerCoin: reviewerCoin});
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
};
    



//환급 정보 입력 화면
exports.postWithdraw = (req, res, next) => { 

    req.params.reviewerId = 1;
     
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;    
    }
    

        const withdrawCoin = req.body.amount;
        const bankName = req.body.bankName;
        const accountOwnerName = req.body.accountHolder;
        const accountNumber = req.body.accountNumber;
        const reviewerId = req.params.reviewerId;

        const withdraw = new Withdraw({
            withdrawCoin: withdrawCoin,
            bankName: bankName,
            accountOwnerName: accountOwnerName,
            accountNumber: accountNumber,
            reviewerId: reviewerId
        });
        
        withdraw
        .save()
        .then(withdraw => {
            res.status(201).json({withdraw:withdraw});
        })
        .catch(err => {
            console.log(err);
          });
        
        
        //DB에 업데이트
        let previousCoin;
        let remainedCoin;

        Reviewer.findByPk(reviewerId).then(reviewer => {
            previousCoin = reviewer.reviewerCoin;
            remainedCoin = previousCoin - withdrawCoin;
            reviewer.reviewerCoin = remainedCoin;
            reviewer.save();
        }).catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);

        });
        
        
        
        

    };
