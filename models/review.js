const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Review = sequelize.define('review', {

    id: {
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },

    reviewDate: {
        type:Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('now()')
    }
},
    {
        timestamps: false
});

module.exports = Review;

