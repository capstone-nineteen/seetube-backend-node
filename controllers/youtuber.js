const Youtuber = require('../models/youtuber');
const Video = require('../models/video');
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
            res.status(201).json({message: 'youtuber created.'});
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
