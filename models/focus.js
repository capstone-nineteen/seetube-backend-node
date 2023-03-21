const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Focus = sequelize.define('focus', {

    id: {
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },

    focusStartTime: {
        type:Sequelize.INTEGER,
        allowNull:false
    },

    focusEndTime: {
        type:Sequelize.INTEGER,
        allowNull:false
    },

    focusRate: {
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

module.exports = Focus;