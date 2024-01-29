const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const seq= require('./util/database');
const Product=require('./models/product');
const Order=require('./models/order');
const Orderitem=require('./models/orderitem');
const User=require('./models/user');
const Cart=require('./models/cart');
const cartitem=require('./models/cartitem');


const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) => {
    User.findByPk(1)
    .then((user)=>{
        req.user=user;
        next();
    })
    .catch(e=>{console.log(e)})
})

Product.belongsTo(User, {constraints:true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through : cartitem});
Product.belongsToMany(Cart , {through: cartitem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product,{through:Orderitem});
Product.belongsToMany(Order,{through:Orderitem});


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


seq
.sync({force:true})
.then(()=>{
   return User.findByPk(1)
})
.then((user)=>{
    if(!user)
    {
        return  User.create({
            name:'mina',
            email:"m123@gmail.com"
          })

    }
    return user  
})
.then((user)=>{

    return user.createCart()
   
}) 
.then((cart)=>{
    app.listen(4005)

})
.catch((e)=>{console.log(e)})
