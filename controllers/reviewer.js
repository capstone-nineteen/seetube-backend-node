const Reviewer = require('../models/reviewer');
const Review = require('../models/review');
const Withdraw = require('../models/withdraw');
const Video = require('../models/video');
const WatchingInfo = require('../models/watchingInfo');

const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {smtpTransport} = require('../util/email');
const ejs = require('ejs');
const path = require('path');
const sequelize = require('sequelize');
const Op = sequelize.Op;

var generateRandom = function(min, max) {
    var ranNum = Math.floor(Math.random()*(max-min+1)) + min;
    return ranNum;
}

exports.emailAuth = (req, res, next) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Please enter a valid email.');
    error.statusCode = 422;
    throw error;
  }
  const email = req.body.email;
  
  
  Reviewer.findOne({where: {reviewerEmail: email}})
   .then(reviewer => {
    if (reviewer) {
        res.status(200).json({message:'A user with this email already exists.', status: 200});
     
    } 
    else {
    const authNumber = generateRandom(111111,999999);
     let emailTemplate;
      ejs.renderFile(path.join(__dirname,'..','template','emailAuth.ejs'), {authCode: authNumber}, function(err, data) {
      if(err) {console.log(err);}
      emailTemplate = data;
      });
        
      
      const mailOptions = {
        from: "Seetube",
        to: email,
        subject: "[Seetube]회원가입 인증 이메일입니다.",
        html: emailTemplate
      };
  
      smtpTransport.sendMail(mailOptions, (error, responses) => {
        if (error) {
          error.statusCode = 401;
          throw error;
         // return res.status(statusCode.OK).send(util.fail(statusCode.BAD_REQUEST, responseMsg.AUTH_EMAIL_SUCCESS));
        } else {
          
          return res.status(200).json({authNumber: authNumber});
          //return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.AUTH_EMAIL_SUCCESS, {
          //  authNumber: authNumber
        };
      
      smtpTransport.close();
    });

  }}).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
     next(err);

  })
    
}




exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    bcrypt.hash(password, 12)
      .then(hashedPw => {
        const reviewer = new Reviewer({
          reviewerEmail: email,
          reviewerPassword: hashedPw,
          reviewerName: name,
          reviewerCoin: 0
          });
  
        reviewer.save()
          .then(reviewer => {
            res.status(200).json({message: 'reviewer created.', status:200});
          })
          .catch(err => {
            if(!err.statusCode) err.statusCode = 500;
            next(err);
          });
      })
    
    
      }
  


exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    let loadedReviewer;
    Reviewer.findOne({ where:{reviewerEmail: email }})
      .then(reviewer => {
        
        if (!reviewer) {
            const error = new Error('A user with this email could not be found');
            error.statusCode = 401;
            throw error;
        }
        
        loadedReviewer = reviewer;
        return bcrypt.compare(password, loadedReviewer.reviewerPassword);
      })
      .then(isEqual => {
        if (isEqual == false) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
          {
            email: loadedReviewer.reviewerEmail,
            id: loadedReviewer.id
          },
          'somesupersecretsecret',
          { expiresIn: '1h' }
        );
        res.status(200).json({ token: token, reviewerId: loadedReviewer.id});
      
     })
     .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
     });
    }

//리뷰어 홈
exports.getReviewerHome = (req, res, next) => {
    
    const reviewerId = req.id;

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
        attributes: ['id', 'videoTitle', 'creator', 'category', 'videoCoin', 'reviewCurrent', 'reviewGoal', 'createdAt', 'reviewDate', 'videoDetail', 'imagePath', 'videoPath'],
        limit:3
    })
        .then(newVideos => {
            
            

            for (let i = 0; i < newVideos.length; i++){
                Review.findOne({
                    where:{videoId: newVideos[i].dataValues.id,
                    reviewerId: reviewerId }
                }).then(review => {
                    if (!review) {newVideos[i].dataValues.isReviewerReviewed = false;}
                    else {newVideos[i].dataValues.isReviewerReviewed = true;}
                }).catch(err => {
                    if(!err.statusCode){
                        err.statusCode = 500;
                    }
                    next(err);
                })
            }
    
    

            section_new.title = '새로운 영상';
            section_new.videos = newVideos;
            videos[0] = section_new;
            
            return Video.findAll({
                where: { category: '여행'},
                attributes: ['id', 'videoTitle', 'creator', 'category', 'videoCoin', 'reviewCurrent', 'reviewGoal', 'createdAt', 'reviewDate', 'videoDetail', 'imagePath', 'videoPath'],
                limit:3
            });
        })
        .then(tripVideos => {

            for (let i = 0; i < tripVideos.length; i++){
                Review.findOne({
                    where:{videoId: tripVideos[i].dataValues.id,
                    reviewerId: reviewerId }
                }).then(review => {
                    if (!review) {tripVideos[i].dataValues.isReviewerReviewed = false;}
                    else {tripVideos[i].dataValues.isReviewerReviewed = true;}
                }).catch(err => {
                    if(!err.statusCode){
                        err.statusCode = 500;
                    }
                    next(err);
                })
            }
            section_trip.title = '여행';
            section_trip.videos = tripVideos;
            videos[1] = section_trip;
            return Video.findAll({
                where: { category: '일상'},
                attributes: ['id', 'videoTitle', 'creator', 'category','videoCoin', 'reviewCurrent', 'reviewGoal', 'createdAt', 'reviewDate', 'videoDetail', 'imagePath', 'videoPath'],
                limit:3
            });
        })
        .then(dailyVideos => {

            for (let i = 0; i < dailyVideos.length; i++){
                Review.findOne({
                    where:{videoId: dailyVideos[i].dataValues.id,
                    reviewerId: reviewerId }
                }).then(review => {
                    if (!review) {dailyVideos[i].dataValues.isReviewerReviewed = false;}
                    else {dailyVideos[i].dataValues.isReviewerReviewed = true;}
                }).catch(err => {
                    if(!err.statusCode){
                        err.statusCode = 500;
                    }
                    next(err);
                })
            }
            section_daily.title = '일상';
            section_daily.videos = dailyVideos;
            videos[2] = section_daily;
            return Video.findAll({
                where: { category:'엔터테인먼트'},
                attributes: ['id', 'videoTitle', 'creator', 'category','videoCoin', 'reviewCurrent', 'reviewGoal', 'createdAt', 'reviewDate', 'videoDetail', 'imagePath', 'videoPath'],
                limit:3
            });
        })
        .then(entertainVideos => {

            for (let i = 0; i < entertainVideos.length; i++){
                Review.findOne({
                    where:{videoId: entertainVideos[i].dataValues.id,
                    reviewerId: reviewerId }
                }).then(review => {
                    if (!review) {entertainVideos[i].dataValues.isReviewerReviewed = false;}
                    else {entertainVideos[i].dataValues.isReviewerReviewed = true;}
                    
                }).catch(err => {
                    if(!err.statusCode){
                        err.statusCode = 500;
                    }
                    next(err);
                })
            }
            section_entertain.title = '엔터테인먼트';
            section_entertain.videos = entertainVideos;
            
            videos[3] = section_entertain;
            reviewerHome[2] = videos;
            //빨리 실행되어버려서 실행 지연해줌
            setTimeout(function(){
                res.status(200).json({userName: reviewerHome[0], coin: reviewerHome[1], sections: reviewerHome[2]})
            }, 100);
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

    const reviewerId = req.id;
    let video = {};
    let videos = [];
    
    

    Video.findAll({
        order: [['createdAt', 'DESC']],
        attributes: ['id','videoTitle', 'creator', 'category', 'videoCoin', 'reviewCurrent', 'reviewGoal', 'createdAt', 'reviewDate', 'videoDetail', 'imagePath', 'videoPath']
    })
        .then(vids => {
            
            
            for (let vid of vids){

                Review.findOne({
                    where:{videoId: vid.id,
                        reviewerId: reviewerId}
                }).then(review => {
                    if (!review) {vid.dataValues.isReviewerReviewed = false;}
                    else {vid.dataValues.isReviewerReviewed = true;}
                    
                    video = vid.dataValues;
                    videos.push(video);
                    
                    if (vid === vids[vids.length-1]){
                        console.log(videos);
                        res.status(200).json({videos:videos});
                    }


                }).catch(err => {
                    if(!err.statusCode){
                        err.statusCode = 500;
                    }
                    next(err);
                })

                
                

            }
            
    

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
    const reviewerId = req.id;

    let videos = [];
    let video = {};

    if (categoryName == "전체") {

        Video.findAll({
            order: [['createdAt', 'DESC']],
            attributes: ['id','videoTitle', 'creator', 'category', 'videoCoin', 'reviewCurrent', 'reviewGoal', 'createdAt', 'reviewDate', 'videoDetail', 'imagePath', 'videoPath']
        })
            .then(vids => {
                
                
                for (let vid of vids){
    
                    Review.findOne({
                        where:{videoId: vid.id,
                            reviewerId: reviewerId}
                    }).then(review => {
                        if (!review) {vid.dataValues.isReviewerReviewed = false;}
                        else {vid.dataValues.isReviewerReviewed = true;}
                        
                        video = vid.dataValues;
                        videos.push(video);
                        
                        if (vid === vids[vids.length-1]){
                            console.log(videos);
                            res.status(200).json({videos:videos});
                        }
    
    
                    }).catch(err => {
                        if(!err.statusCode){
                            err.statusCode = 500;
                        }
                        next(err);
                    })
    
                    
                    
    
                }
                
        
    
            })
            
            .catch(err => {
                if(!err.statusCode){
                    err.statusCode = 500;
                }
                next(err);
        });
    }

    else {
    Video.findAll({
       where: {category: categoryName},
       order: [['createdAt', 'DESC']],
       attributes: ['id','videoTitle', 'creator', 'category','videoCoin', 'reviewCurrent', 'reviewGoal', 'createdAt', 'reviewDate', 'videoDetail', 'imagePath', 'videoPath']
    })
    .then(vids => {
            
        if (vids.length == 0) {res.status(200).json({videos:vids});}
        
        else {
            for (let vid of vids){

                Review.findOne({
                    where:{videoId: vid.id,
                        reviewerId: reviewerId}
                }).then(review => {
                    if (!review) {vid.dataValues.isReviewerReviewed = false;}
                    else {vid.dataValues.isReviewerReviewed = true;}
                    
                    video = vid.dataValues;
                    videos.push(video);
                    
                    if (vid === vids[vids.length-1]){
                        console.log(videos);
                        res.status(200).json({videos:videos});
                    }

                })
                .catch(err => {
                    if(!err.statusCode){
                        err.statusCode = 500;
                    }
                    next(err);
                })
             }
            }

            }).catch(err => {
                if(!err.statusCode){
                    err.statusCode = 500;
                }
                next(err);
            })

            
            
        }
        }
        


    

//검색 결과 영상목록
exports.searchVideos = (req, res, next) => {
    const reviewerId = req.id;
    let videos = [];
    let video = {};
    
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
        attributes: ['id', 'videoTitle', 'creator', 'category','videoCoin', 'reviewCurrent', 'reviewGoal', 'createdAt', 'reviewDate', 'videoDetail', 'imagePath', 'videoPath']
    })
        .then(vids => {
        
        if (vids.length == 0){res.status(201).json({videos:vids});}
            
        else{    
        for (let vid of vids){

            Review.findOne({
                where:{videoId: vid.id,
                    reviewerId: reviewerId}
            }).then(review => {
                if (!review) {vid.dataValues.isReviewerReviewed = false;}
                else {vid.dataValues.isReviewerReviewed = true;}
                
                video = vid.dataValues;
                videos.push(video);
                
                if (vid === vids[vids.length-1]){
                    console.log(videos);
                    res.status(200).json({videos:videos});
                }


            }).catch(err => {
                if(!err.statusCode){
                    err.statusCode = 500;
                }
                next(err);
            })

        }
            

        }
        


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

    const reviewerId = req.id;
    Reviewer.findOne({
        where: {id: reviewerId},
        attributes: ['reviewerName', 'reviewerCoin']
    }).then(reviewer => {
        myPage[0] = reviewer.reviewerName;
        myPage[1] = reviewer.reviewerCoin;
        return Review.findAll({
            where:{reviewerId: reviewerId},
            attributes: ['reviewDate'],
            order: [['reviewDate', 'DESC']],
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
            order: [['withdrawDate', 'DESC']],
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
    
    //const reviewerId = req.reviewerId;
    const reviewerId = req.id;

    Reviewer.findOne({
        where: {id: reviewerId},
        attributes: ['reviewerCoin']
    }).then(reviewer => {
        res.status(200).json({reviewerCoin: reviewer.reviewerCoin});
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
};
    



//환급 정보 입력 화면
exports.postWithdraw = (req, res, next) => { 

    //const reviewerId = req.reviewerId;
    const reviewerId = req.id;
    
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
            res.status(201).json({message: 'success', status:201});
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

exports.postReview = (req, res, next) => {

    const reviewerId = req.id; //토큰으로 확인
    const videoId = req.query.videoId;//파라미터로 보내야 하는 값

    const review = new Review({
        reviewerId: reviewerId,
        videoId: videoId
    });

    review.save()
    .then(review => {
        res.status(200).json({message: 'review finished', status:200});
    })


    let videoCoin;
    let previousCoin;
    let currentCoin;

    Video.findByPk(videoId).then(video => {
        videoCoin = video.videoCoin;
        return Reviewer.findByPk(reviewerId)
    }).then(reviewer => {
        previousCoin = reviewer.reviewerCoin;
        currentCoin = previousCoin + videoCoin;
        reviewer.reviewerCoin = currentCoin;
        reviewer.save();
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });

    
  

}

exports.postWatchingInfos = (req, res, next) => {
    const reviewerId = req.id;
    const videoId = req.query.videoId;

    const review = new Review({
        reviewerId: reviewerId,
        videoId: videoId
    });

    review.save();

    const watchingInfos = req.body.watchingInfos;

    const watchingInfo = new WatchingInfo({
        watchingInfos: watchingInfos,
        reviewerId: reviewerId,
        videoId: videoId
    });

    watchingInfo.save()
    .then(watchingInfo => {
        res.status(200).json({message: 'watchingInfos and review saved', status:200});
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })


    let videoCoin;
    let previousCoin;
    let currentCoin;

    Video.findByPk(videoId).then(video => {
        videoCoin = video.videoCoin;
        return Reviewer.findByPk(reviewerId)
    }).then(reviewer => {
        previousCoin = reviewer.reviewerCoin;
        currentCoin = previousCoin + videoCoin;
        reviewer.reviewerCoin = currentCoin;
        reviewer.save();
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });

    
  
    
}
