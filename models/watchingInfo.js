const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const WatchingInfo = sequelize.define('watchingInfo', {

    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },

    
    watchingInfos:{
        type:Sequelize.JSON,
        allowNull:false
    }
    
}, {
    timestamps: false,
    initialAutoIncrement:1
});

module.exports = WatchingInfo;
