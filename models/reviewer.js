const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Reviewer = sequelize.define('reviewer', {

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    reviewerName: {
        type: Sequelize.STRING,
        allowNull:false
    },

    reviewerEmail: {
        type: Sequelize.STRING,
        allowNull: false
    },

    reviewerPassword: {
        type: Sequelize.TEXT,
        allowNull:false
    },
    
    reviewerCoin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
}, { initialAutoIncrement: 1});

module.exports = Reviewer;