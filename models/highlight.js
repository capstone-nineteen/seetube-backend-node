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


    FirstSceneFocusRate: {
        type:Sequelize.FLOAT,
        allowNull: false
    },

    FirstSceneEmotion: {
        type: Sequelize.STRING,
        allowNull: false
    },

    FirstSceneEmotionRate: {
        type:Sequelize.FLOAT,
        allowNull: false
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

    SecondSceneFocusRate: {
        type:Sequelize.FLOAT,
        allowNull:false
    },

    SecondSceneEmotion: {
        type: Sequelize.STRING,
        allowNull:false
    },

    SecondSceneEmotionRate: {
        type: Sequelize.FLOAT,
        allowNull: false
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

    ThirdSceneFocusRate:{
        type:Sequelize.FLOAT,
        allowNull: false
    },

    ThirdSceneEmotion: {
        type:Sequelize.STRING,
        allowNull:false
    },

    ThirdSceneEmotionRate: {
        type:Sequelize.FLOAT,
        allowNull: false
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
    }

    
},
{
    timestamps: false,
    initialAutoIncrement: 1
});

module.exports = Highlight;