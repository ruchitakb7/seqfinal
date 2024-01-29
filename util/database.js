const Sequelize = require('sequelize');

const sequelize = new Sequelize('app', 'root', 'ruchita123@', {
    dialect: 'mysql',
    host: 'localhost'
  });
  
  module.exports = sequelize;