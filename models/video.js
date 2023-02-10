const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Video = sequelize.define('video', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    videoTitle: {
        type: Sequelize.STRING,
        allowNull: false
    },
    
    videoDetail: {
        type: Sequelize.STRING,
        allowNull: false
    },

    videoPath: {
        type:Sequelize.TEXT,
        allowNull: false

    },

    imagePath: {
        type:Sequelize.TEXT,
        allowNull:false
    },

    reviewGoal: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    reviewCurrent: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

    reviewDate: {
        type:Sequelize.DATE,
        allowNull: false
        
    },

    videoCoin: {
        type: Sequelize.INTEGER,
        allowNull:false
    },

    category: {
        type: Sequelize.STRING,
        allowNull:false
    },

    isReviewed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    },
    creator: {
        type: Sequelize.STRING,
        allowNull:false
    }
});

module.exports = Video;

    