const express = require('express');
const path = require('path');

// Config path
// const rootDir = require('../util/path');

// Controller 
const adminController = require('../controllers/admin')

const router = express.Router();

// admin/add-product => GET
router.get('/add-product', adminController.getAddProduct)
// admin/products => GET
router.get('/products', adminController.getProducts)

// // admin/product => POST
router.post('/product', adminController.postAddProduct)

router.get('/edit-product/:productId', adminController.getEditProduct)

router.post('/edit-product', adminController.postEditProduct)

router.post('/delete-product', adminController.postDeleteProduct)

module.exports = router;

