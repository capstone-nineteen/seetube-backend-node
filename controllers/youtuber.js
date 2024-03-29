const Youtuber = require('../models/youtuber');
const Video = require('../models/video');
const Focus = require('../models/focus');
const Emotion = require('../models/emotion');
const SceneStealer = require('../models/sceneStealer');
const Shorts = require('../models/shorts');
const Highlight = require('../models/highlight');

const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const mysql = require('mysql2');

const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {smtpTransport} = require('../util/email');
const ejs = require('ejs');
const path = require('path');

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
  
  
  Youtuber.findOne({where: {youtuberEmail: email}})
   .then(youtuber => {
    if (youtuber) {
     const error = new Error('A user with this email already exists.');
     error.statusCode = 422;
     throw error;
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
        const youtuber = new Youtuber({
          youtuberEmail: email,
          youtuberPassword: hashedPw,
          youtuberName: name
          });
  
        youtuber.save()
          .then(youtuber => {
            res.status(200).json({message: 'youtuber created.', status:200});
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

    let loadedYoutuber;
    Youtuber.findOne({ where:{youtuberEmail: email }})
      .then(youtuber => {
        
        if (!youtuber) {
            const error = new Error('A user with this email could not be found');
            error.statusCode = 401;
            throw error;
        }
        
        loadedYoutuber = youtuber;
        return bcrypt.compare(password, loadedYoutuber.youtuberPassword);
      })
      .then(isEqual => {
        if (isEqual == false) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
          {
            email: loadedYoutuber.youtuberEmail,
            id: loadedYoutuber.id
          },
          'somesupersecretsecret',
          { expiresIn: '1h' }
        );
        res.status(200).json({ token: token, youtuberId: loadedYoutuber.id});
      
     })
     .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
     });
    }

//유튜버 홈
exports.getYoutuberHome = (req, res, next) => {

    const youtuberId = req.id;
    //const youtuberId = req.id;

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
    
                attributes:['id','videoTitle', 'creator','category', 'videoCoin', 'reviewCurrent', 'reviewGoal', 'createdAt', 'reviewDate', 'videoDetail', 'imagePath', 'videoPath']
            })
        })
        .then(finishedReviews => {
            youtuberHome[1] = finishedReviews;

            return Video.findAll({
                where:{youtuberId: youtuberId,
                        isReviewed: false},
    
                attributes:['id','videoTitle', 'creator', 'category', 'videoCoin', 'reviewCurrent', 'reviewGoal', 'createdAt', 'reviewDate', 'videoDetail', 'imagePath', 'videoPath']
            
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

//num of total reviewers를 watching Info의 count로 가져오는 게 맞을 것같다
//데이터 가져올 때 num of total reviewers가 review goal을 달성했을 때 나와야 할 것
exports.getFocus = (req, res, next) => {

  const videoId = req.params.videoId;

  const FocusReport = [];
  
  var numOfTotalReviewers = 0;

  
  Video.findOne({
    where:{id: videoId},
    attributes:['reviewGoal','videoPath']
  })
  .then(video => {

    if (!video) {
      const error = new Error('could not find video.');
      error.statusCode = 404;
      throw error;
    }

    FocusReport[0] = video.videoPath;
    numOfTotalReviewers = video.reviewGoal;

    return Focus.findAll({
      where:{videoId: videoId},
      order: [['focusRate', 'DESC']],
      attributes:['thumbnailURL', 'focusStartTime', 'focusEndTime', 'focusRate']
    });
    
  })
  .then(scenes => {
      
    for (let i = 0; i < scenes.length; i++){

      let focusRate = scenes[i].focusRate;
      scenes[i].dataValues.totalNumberOfReviewers = numOfTotalReviewers;
      let numberOfReviewersConcentrated = focusRate * numOfTotalReviewers;
      scenes[i].dataValues.numberOfReviewersConcentrated = parseInt(numberOfReviewersConcentrated);
    }

    FocusReport[1] = scenes;

    res.status(200).json({originalVideoURL:FocusReport[0], scenes:FocusReport[1]});
      
   })
   .catch(err => {
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
});
}

exports.getEmotion = (req, res, next) => {

  const videoId = req.params.videoId;

  const EmotionReport = [];
  
  var numOfTotalReviewers = 0;

  
  Video.findOne({
    where:{id: videoId},
    attributes:['reviewGoal','videoPath']
  })
  .then(video => {

    if (!video) {
      const error = new Error('could not find video.');
      error.statusCode = 404;
      throw error;
    }

    EmotionReport[0] = video.videoPath;
    numOfTotalReviewers = video.reviewGoal;

    return Emotion.findAll({
      where:{videoId: videoId},
      order: [['emotionRate', 'DESC']],
      attributes:['thumbnailURL', 'emotion', 'emotionStartTime', 'emotionEndTime', 'emotionRate']
    });
    
  })
  .then(scenes => {
      
    for (let i = 0; i < scenes.length; i++){

      let emotionRate = scenes[i].emotionRate;
      scenes[i].dataValues.totalNumberOfReviewers = numOfTotalReviewers;
      let numberOfReviewersFelt = emotionRate * numOfTotalReviewers;
      scenes[i].dataValues.numberOfReviewersFelt = parseInt(numberOfReviewersFelt);
    }

    EmotionReport[1] = scenes;

    res.status(200).json({originalVideoURL:EmotionReport[0], scenes:EmotionReport[1]});
      
   })
   .catch(err => {
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
});
}

exports.getSceneStealer = (req, res, next) => {

  const videoId = req.params.videoId;

  SceneStealer.findAll({
    where:{videoId: videoId},
    order: [['percentageOfConcentration', 'DESC']],
    })
  .then(sceneStealer => {

    res.status(200).json({sceneStealer:sceneStealer});

    
    
  })
  .catch(err => {
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
  })

}

exports.getShorts = (req, res, next) => {

  const videoId = req.params.videoId;

  Shorts.findAll({
    where:{videoId: videoId},
    order: [['percentageOfConcentration', 'DESC']],
    })
  .then(shorts => {

    res.status(200).json({shorts:shorts});

    
    
  })
  .catch(err => {
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
  })

}





exports.getHighlight = (req, res, next) => {

  const videoId = req.params.videoId;

  
  
  var numOfTotalReviewers = 0;

  var numberOfReviewersConcentratedInFirstScene = 0;
  var numberOfReviewersFeltInFirstScene = 0;
  
  var numberOfReviewersConcentratedInSecondScene = 0;
  var numberOfReviewersFeltInSecondScene = 0;
  
  var numberOfReviewersConcentratedInThirdScene = 0;
  var numberOfReviewersFeltInThirdScene = 0;
  
  var numberOfReviewersConcentratedInFourthScene = 0;
  var numberOfReviewersFeltInFourthScene = 0;
  
  var numberOfReviewersConcentratedInFifthScene = 0;
  var numberOfReviewersFeltInFifthScene = 0;
  
  Video.findOne({
    where:{id: videoId},
    attributes:['reviewGoal']
  })
  .then(video => {

    if (!video) {
      const error = new Error('could not find video.');
      error.statusCode = 404;
      throw error;
    }

    
    numOfTotalReviewers = video.reviewGoal;

    return Highlight.findOne({
      where:{videoId: videoId}
    });
    
  })
  .then(highlight => {

    numberOfReviewersConcentratedInFirstScene = highlight.focusRateInFirstScene * numOfTotalReviewers;
    numberOfReviewersFeltInFirstScene = highlight.emotionRateInFirstScene * numOfTotalReviewers;

    numberOfReviewersConcentratedInSecondScene = highlight.focusRateInSecondScene * numOfTotalReviewers;
    numberOfReviewersFeltInSecondScene = highlight.focusRateInSecondScene * numOfTotalReviewers;

    numberOfReviewersConcentratedInThirdScene = highlight.focusRateInThirdScene * numOfTotalReviewers;
    numberOfReviewersFeltInThirdScene = highlight.focusRateInThirdScene * numOfTotalReviewers;

    numberOfReviewersConcentratedInFourthScene = highlight.focusRateInFourthScene * numOfTotalReviewers;
    numberOfReviewersFeltInFourthScene = highlight.focusRateInFourthScene * numOfTotalReviewers;

    numberOfReviewersConcentratedInFifthScene = highlight.focusRateInFifthScene * numOfTotalReviewers;
    numberOfReviewersFeltInFifthScene = highlight.focusRateInFifthScene * numOfTotalReviewers;

    highlight.dataValues.numberOfReviewersConcentratedInFirstScene = parseInt(numberOfReviewersConcentratedInFirstScene);
    highlight.dataValues.numberOfReviewersFeltInFirstScene = parseInt(numberOfReviewersFeltInFirstScene);

    highlight.dataValues.numberOfReviewersConcentratedInSecondScene = parseInt(numberOfReviewersConcentratedInSecondScene);
    highlight.dataValues.numberOfReviewersFeltInSecondScene = parseInt(numberOfReviewersFeltInSecondScene);

    highlight.dataValues.numberOfReviewersConcentratedInThirdScene = parseInt(numberOfReviewersConcentratedInThirdScene);
    highlight.dataValues.numberOfReviewersFeltInThirdScene = parseInt(numberOfReviewersFeltInThirdScene);

    highlight.dataValues.numberOfReviewersConcentratedInFourthScene = parseInt(numberOfReviewersConcentratedInFourthScene);
    highlight.dataValues.numberOfReviewersFeltInFourthScene = parseInt(numberOfReviewersFeltInFourthScene);

    highlight.dataValues.numberOfReviewersConcentratedInFifthScene = parseInt(numberOfReviewersConcentratedInFifthScene);
    highlight.dataValues.numberOfReviewersFeltInFifthScene = parseInt(numberOfReviewersFeltInFifthScene);

    highlight.dataValues.emotionTypeInFirstScene = highlight.emotionInFirstScene;
    highlight.dataValues.emotionTypeInSecondScene = highlight.emotionInSecondScene;
    highlight.dataValues.emotionTypeInThirdScene = highlight.emotionInThirdScene;
    highlight.dataValues.emotionTypeInFourthScene = highlight.emotionInFourthScene;
    highlight.dataValues.emotionTypeInFifthScene = highlight.emotionInFifthScene;

    res.status(200).json({highlight:highlight});
  })
.catch(err => {
  if(!err.statusCode){
      err.statusCode = 500;
  }
  next(err);
})
}
