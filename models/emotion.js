const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Emotion = sequelize.define('emotion', {

    id: {
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },

    emotion: {
        type:Sequelize.STRING,
        allowNull:false
    },

    emotionStartTime: {
        type:Sequelize.INTEGER,
        allowNull:false
    },

    emotionEndTime: {
        type:Sequelize.INTEGER,
        allowNull:false
    },

    emotionRate: {
        type:Sequelize.FLOAT,
        allowNull:false
    },

    thumbnailURL:{
        type:Sequelize.TEXT,
        allowNull:false
    }

},
{
    timestamps: false,
    initialAutoIncrement: 1
});

module.exports = Emotion;