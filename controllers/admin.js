const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing:false
  });
};



exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  console.log(req.user)
 
  req.user.createProduct({
    title:title,
    imageUrl:imageUrl,
    description:description,
    price:price
  //  userId: req.user.id
  })
  .then(()=>{
    res.redirect('/');
  })
  .catch((e)=>{console.log(e)})
  
};

exports.geteditProduct = (req, res, next) => {
  const editMode = req.query.edit;
   if (!editMode) {
   return res.redirect('/');
  }
  const prodId= req.params.productId;
 // Product.findByPk(prodId) 
 req.user.getProducts(prodId)
  .then((result)=>{
    console.log(result)
    res.render('admin/edit-product', {
      pageTitle: 'edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: result
    });
  })
  .catch((e)=>{
    res.redirect('/');
  })
  
};

exports.posteditproduct = (req,res,next) =>{
const prodId =req.body.productId;

const p={
 title:req.body.title,
imageurl:req.body.imageUrl,
description:req.body.description,
price:req.body.price
}

Product.update(p,{where:{id:prodId}})
.then((result)=>{
 
  res.redirect('/admin/products');
})
.catch((e)=>{ if(e) throw e })

}

exports.getProducts = (req, res, next) => {
  Product.findAll() 
  .then((result)=>{
    res.render('admin/products', {
      prods: result,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    })
    
    })
    .catch((e)=>{
      console.log(e)
  })
   
};

exports.deleteproduct =(req,res,mext) =>{
  const id= req.body.id;
  console.log(id);
  Product.destroy({where:{id:id}})
  .then(()=>{
    res.redirect('/admin/products')
  })
  .catch((e)=>{console.log(e)})
}
