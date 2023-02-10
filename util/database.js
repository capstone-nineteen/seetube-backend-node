const Sequelize = require('sequelize');

const sequelize = new Sequelize('seetube', 'root', 'nineteen1919!', {
  dialect: 'mysql',
  host: 'localhost',
  timezone: '+09:00'
});

module.exports = sequelize;
