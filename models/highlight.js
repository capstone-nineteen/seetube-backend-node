const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Highlight = sequelize.define('highlight', {

    id: {
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },

    videoURL: {
        type:Sequelize.TEXT,
        allowNull:false
    },


    FirstSceneStartTimeInOriginalVideo: {
        type:Sequelize.INTEGER,
        allowNull:false
    },

    FirstSceneEndTimeInOriginalVideo: {
        type:Sequelize.INTEGER,
        allowNull:false
    },

    FirstSceneStartTimeInHighlight: {
        type:Sequelize.INTEGER,
        allowNull: false
    },

    FirstSceneEndTimeInHighlight: {
        type:Sequelize.INTEGER,
        allowNull: false
    },

    thumbnailInFirstScene: {
        type:Sequelize.TEXT,
        allowNull:false
    },

    focusRateInFirstScene: {
        type:Sequelize.FLOAT,
        allowNull:false
    },

    emotionRateInFirstScene: {
        type:Sequelize.FLOAT,
        allowNull:false
    },

    emotionInFirstScene: {
        type:Sequelize.STRING,
        allowNull:false
    },

    
    SecondSceneStartTimeInOriginalVideo: {
        type:Sequelize.INTEGER,
        allowNull:false
    },

    SecondSceneEndTimeInOriginalVideo: {
        type:Sequelize.INTEGER,
        allowNull:false
    },

    SecondSceneStartTimeInHighlight: {
        type:Sequelize.INTEGER,
        allowNull: false
    },

    SecondSceneEndTimeInHighlight: {
        type:Sequelize.INTEGER,
        allowNull: false
    },

    thumbnailInSecondScene: {
        type:Sequelize.TEXT,
        allowNull:false
    },

    focusRateInSecondScene: {
        type:Sequelize.FLOAT,
        allowNull:false
    },

    emotionRateInSecondScene: {
        type:Sequelize.FLOAT,
        allowNull:false
    },

    emotionInSecondScene: {
        type:Sequelize.STRING,
        allowNull:false
    },


    ThirdSceneStartTimeInOriginalVideo: {
        type:Sequelize.INTEGER,
        allowNull:false
    },

    ThirdSceneEndTimeInOriginalVideo: {
        type:Sequelize.INTEGER,
        allowNull:false
    },

    ThirdSceneStartTimeInHighlight: {
        type:Sequelize.INTEGER,
        allowNull: false
    },

    ThirdSceneEndTimeInHighlight: {
        type:Sequelize.INTEGER,
        allowNull: false
    },

    thumbnailInThirdScene: {
        type:Sequelize.TEXT,
        allowNull:false
    },

    focusRateInThirdScene: {
        type:Sequelize.FLOAT,
        allowNull:false
    },

    emotionRateInThirdScene: {
        type:Sequelize.FLOAT,
        allowNull:false
    },

    emotionInThirdScene: {
        type:Sequelize.STRING,
        allowNull:false
    },

    FourthSceneStartTimeInOriginalVideo: {
        type:Sequelize.INTEGER,
        allowNull:false
    },

    FourthSceneEndTimeInOriginalVideo: {
        type:Sequelize.INTEGER,
        allowNull:false
    },

    FourthSceneStartTimeInHighlight: {
        type:Sequelize.INTEGER,
        allowNull: false
    },

    FourthSceneEndTimeInHighlight: {
        type:Sequelize.INTEGER,
        allowNull: false
    },

    thumbnailInFourthScene: {
        type:Sequelize.TEXT,
        allowNull:false
    },

    focusRateInFourthScene: {
        type:Sequelize.FLOAT,
        allowNull:false
    },

    emotionRateInFourthScene: {
        type:Sequelize.FLOAT,
        allowNull:false
    },

    emotionInFourthScene: {
        type:Sequelize.STRING,
        allowNull:false
    },

    FifthSceneStartTimeInOriginalVideo: {
        type:Sequelize.INTEGER,
        allowNull:false
    },

    FifthSceneEndTimeInOriginalVideo: {
        type:Sequelize.INTEGER,
        allowNull:false
    },

    FifthSceneStartTimeInHighlight: {
        type:Sequelize.INTEGER,
        allowNull: false
    },

    FifthSceneEndTimeInHighlight: {
        type:Sequelize.INTEGER,
        allowNull: false
    },

    thumbnailInFifthScene: {
        type:Sequelize.TEXT,
        allowNull:false
    },

    focusRateInFifthScene: {
        type:Sequelize.FLOAT,
        allowNull:false
    },

    emotionRateInFifthScene: {
        type:Sequelize.FLOAT,
        allowNull:false
    },

    emotionInFifthScene: {
        type:Sequelize.STRING,
        allowNull:false
    },

    
},
{
    timestamps: false,
    initialAutoIncrement: 1
});

module.exports = Highlight;