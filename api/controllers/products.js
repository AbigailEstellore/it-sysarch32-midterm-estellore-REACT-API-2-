const Product = require('../models/product');
const mongoose = require('mongoose');

exports.products_get_all = (req, res, next)=>{
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs =>{
        const response ={
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        }
       // if(docs.lenght >= 0) {
            res.status(200).json(response);
       // }else{
      //  res.status(404).json({
      //         message: 'No entries found'
      //   });
       // }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.products_create_product = (req, res, next)=>{
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
        .save()
        .then(result =>{
        console.log(result);
         res.status(201).json({
             message: 'Created product successfully',
            createdProduct: {
                  name: result.name,
                  price: result.price,
                  _id: result._id,
                  request: {
                     type: 'GET',
                     url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.products_get_product = (req, res, next) => {
    const id = req.params.productid;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/'
                    }
                });
            }else{
                res.status(400).json({message: 'No valid entry found for provided ID'});
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err });
        });
}

exports.products_update_product = (req, res, next) => {
    const id = req.params.productid;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.findOneAndUpdate({ _id: id }, { $set: updateOps }, { new: true })
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: 'Product Updated',
                    updatedProduct: result,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:300/products/' + id
                    }
                });
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.products_delete = (req, res, next)=> {
    const id = req.params.productid;
    Product.findByIdAndDelete(id)
    .exec()
    .then(result => {
        if (result) {
            res.status(200).json({ 
                message: 'Product deleted',
                productDeleted: result,
                request: {
                    type: 'POST',
                    url: 'http://localhost:300/products/',
                    body: {name: 'String', price: 'Number'}
                }
            });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        }); 
   });
}