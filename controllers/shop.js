const Product = require('../models/product');
const Cart = require('../models/cart');
//const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then((result)=>{
    res.render('shop/product-list', {
      prods: result,
      pageTitle: 'All Products',
      path: '/products'
    })

  }) 
  .catch((e)=>{console.log(e)})
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart()
  .then(cart => {
    return cart.getProducts({where:{id: prodId}});
  })
  .then(products => {
    const product = products[0];
    product.Cartitem.destroy();
  })
  .then(result => {
    res.redirect('/cart');
  })
  .catch(err => console.log(err));
};

exports.getproduct=(req,res,next) => {

  const prodId=req.params.productID;
  //console.log(prodID);
  Product.findByPk({where : {id :prodId}})
  .then((result)=>{

    res.render('shop/product-detail',{
      product: result, 
     pageTitle: result.title, 
     path: '/products'
    })
   })
   .catch((e)=>{console.log(e)})  
  
}

exports.getIndex = (req, res, next) => {
  Product.findAll()
   .then((result)=>{
    res.render('shop/index', {
      prods: result,
      pageTitle: 'Shop',
      path: '/'
    });
   })
   .catch((e)=>{console.log(e)})
};

exports.getCart = (req, res, next) => {

  req.user.getCart()
  .then(cart => {
    return cart.getProducts()
    .then(products => {
      res.render('shop/cart', {
              path: '/cart',
              pageTitle: 'Your Cart',
              products: products
            });
    })
    .catch(err => console.log(err));
  })
  .catch(err => console.log(err));
};

exports.postCart =(req,res,next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  req.user.getCart()
 .then(cart => {
  fetchedCart = cart;

  console.log(cart.getProducts({where: {id:1}}));

  return cart.getProducts({where: {id:prodId}});
 })
 .then(products => {
  console.log(products)
    let product;
    if(products.length > 0)
    {
      product = products[0];
    }
    
    if(product){
    
      const oldQuantity = product.cartitem.quantity;
      newQuantity = oldQuantity + 1;
      return product
    }
    return Product.findByPk(prodId)
  }) 
.then((product =>{
  return fetchedCart.addProduct(product, {
    through: {quantity: newQuantity}
  });

}))
 .then(() => {
  res.redirect('/cart')
 })
 .catch(err => console.log(err));
};



exports.getOrders = (req, res, next) => {
  req.user.getOrders({include :['products']})
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders : orders
    });

  })
  .catch(e => {console.log(e)})
 
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
   req.user.getCart()
  .then((cart)=>{
    return cart.getProducts({where :{id:prodId}});
  })
  .then((products)=>{
    const product=products[0];
    return product.cartitem.destroy()
  })
  .then(()=>{
    res.redirect('/cart')
  })
  .catch((e)=>{console.log(e)})
};

exports.postorder = (req,res,next)=>{
  let fetchedCart;
  req.user.getCart()
  .then(cart =>{
    fetchedCart=cart;
    return cart.getProducts();
  })
  .then(products =>{
    req.user.createOrder()
    .then(order=>{
     return order.addProducts(
      products.map(product =>{
        product.orderitem ={ quantity : product.cartitem.quantity}
        return product;
      })
      )
    })
    .catch((e)=>{console.log(e)  })
    })
    .then( result => {
      return fetchedCart.setProducts(null)
     
    })
    .then( () =>{
      res.redirect('/orders')
    })
  .catch((e)=>{console.log(e)
  })
}
