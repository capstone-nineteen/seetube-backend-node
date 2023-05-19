const Sequelize = require('sequelize');

const sequelize = new Sequelize('seetube', 'root', '', {
  dialect: 'mysql',
  host: '',
  timezone: '+09:00'
});

module.exports = sequelize;


