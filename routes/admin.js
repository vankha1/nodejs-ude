const express = require('express');
const path = require('path');

// Config path
// const rootDir = require('../util/path');

// Controller 
const adminController = require('../controllers/admin')

// Middleware
const isAuth = require('../middleware/is-auth')

const router = express.Router();

// admin/add-product => GET
router.get('/add-product', isAuth ,adminController.getAddProduct)
// admin/products => GET
router.get('/products', isAuth , adminController.getProducts)

// // admin/product => POST
router.post('/product', isAuth , adminController.postAddProduct)

router.get('/edit-product/:productId', isAuth , adminController.getEditProduct)

router.post('/edit-product', isAuth , adminController.postEditProduct)

router.post('/delete-product', isAuth , adminController.postDeleteProduct)

module.exports = router;

