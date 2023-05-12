const path = require('path');

const express = require('express');;
const bodyParser = require('body-parser');
const sequelize = require('./util/database');


const reviewerRoutes = require('./routes/reviewer');
const youtuberRoutes = require('./routes/youtuber');


const Reviewer = require('./models/reviewer');
const Video = require('./models/video');
const Youtuber = require('./models/youtuber');
const Review = require('./models/review');
const Withdraw = require('./models/withdraw');
const WatchingInfo = require('./models/watchingInfo');
const Focus = require('./models/focus');
const Emotion = require('./models/emotion');
const SceneStealer = require('./models/sceneStealer');
const Shorts = require('./models/shorts');
const Highlight = require('./models/highlight');

Video.belongsTo(Youtuber, { constraints: true, onDelete: 'CASCADE'});
Youtuber.hasMany(Video);

Review.belongsTo(Reviewer, { constraints: true, onDelete: 'CASCADE'});
Reviewer.hasMany(Review);

Review.belongsTo(Video, {constraints: true, onDelete: 'CASCADE'});
Video.hasMany(Review);

Withdraw.belongsTo(Reviewer, { constraints: true, onDelete: 'CASCADE' });
Reviewer.hasMany(Withdraw);

WatchingInfo.belongsTo(Reviewer, { constraints: true, onDelete: 'CASCADE'});
Reviewer.hasMany(WatchingInfo);

WatchingInfo.belongsTo(Video, { constraints: true, onDelete: 'CASCADE'});
Video.hasMany(WatchingInfo);

Focus.belongsTo(Video, { constraints: true, onDelete: 'CASCADE'});
Video.hasMany(Focus);

Emotion.belongsTo(Video, { constraints: true, onDelete:'CASCADE'});
Video.hasMany(Emotion);

SceneStealer.belongsTo(Video, { constraints: true, onDelete: 'CASCADE'});
Video.hasMany(SceneStealer);

Shorts.belongsTo(Video, { constraints: true, onDelete: 'CASCADE'});
Video.hasMany(Shorts);

Highlight.belongsTo(Video, { constraints: true, onDelete: 'CASCADE'});
Video.hasOne(Highlight);

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  

  
  app.use('/reviewer', reviewerRoutes);
  app.use('/youtuber', youtuberRoutes);
  

  app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({message: message, status: status})
  });
  

  sequelize
  .sync()
  // .sync()
  .then(result => {
    return Reviewer.findByPk(1);
    // console.log(result);
  })
  .then(reviewer => {
    if (!reviewer) {
      return Reviewer.create({reviewerName: 'Max', reviewerEmail: 'test@test.com', reviewerPassword: '1234', reviewerCoin: 100 });
    }
    return reviewer;
  })
  .then(reviewer => {
    // console.log(user);
    app.listen(8080);
  })
  .catch(err => {
    console.log(err);
  });

  
