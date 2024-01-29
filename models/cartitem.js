const Sequelize = require('sequelize');

const sequelize= require('../util/database');

const cartitem = sequelize.define(  'cartitem', {
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
module.exports=cartitem;