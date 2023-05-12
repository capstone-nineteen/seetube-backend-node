const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Shorts = sequelize.define('shorts', {

    id: {
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },

    thumbnailURL: {
        type:Sequelize.TEXT,
        allowNull:false
    },

    videoURL: {
        type:Sequelize.TEXT,
        allowNull:false
    },

    startTime: {
        type:Sequelize.INTEGER,
        allowNull:false
    },

    endTime: {
        type:Sequelize.INTEGER,
        allowNull:false
    },

    percentageOfConcentration: {
        type:Sequelize.FLOAT,
        allowNull:false
    }

    
},
{
    timestamps: false,
    initialAutoIncrement: 1
});

module.exports = Shorts;