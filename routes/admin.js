const express = require('express');
const path = require('path');

// Config path
// const rootDir = require('../util/path');

// Controller 
const productController = require('../controllers/products')

const router = express.Router();


router.get('/add-product', productController.getAddProduct)

router.post('/product', productController.postAddProduct)

module.exports = router;

