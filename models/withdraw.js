const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Withdraw = sequelize.define('withdraw', {
    id: {
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    
    withdrawCoin: {
        type:Sequelize.INTEGER,
        allowNull:false
    },

    withdrawDate: {
        type:Sequelize.DATE,
        allowNull:false,
        defaultValue:Sequelize.literal('now()')
    },

    bankName: {
        type:Sequelize.STRING,
        allowNull:false
    },

    accountOwnerName: {
        type:Sequelize.STRING,
        allowNull: false
    },

    accountNumber: {
        type:Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = Withdraw;