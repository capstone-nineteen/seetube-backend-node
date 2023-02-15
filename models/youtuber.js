const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Youtuber = sequelize.define('youtuber', {
    
    id: {
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    youtuberName: {
        type:Sequelize.STRING,
        allowNull: false
    },

    youtuberEmail: {
        type:Sequelize.STRING,
        allowNull: false
    },

    youtuberPassword: {
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports = Youtuber;