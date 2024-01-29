const Sequelize = require('sequelize');

const sequelize= require('../util/database');

const orderitem = sequelize.define(  'orderitem', {
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    quantity:{
        type:Sequelize.INTEGER
    }
})
module.exports=orderitem;