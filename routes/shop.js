const express = require('express');
// const path = require('path');
const { log } = require('console');

// const rootDir = require('../util/path');
const router = express.Router();

// Controller 
const shopController = require('../controllers/shop')


router.get('/', shopController.getIndex)
router.get('/products', shopController.getProducts)
router.get('/cart', shopController.getCart)
router.get('/orders', shopController.getOrders)
router.get('/checkout', shopController.getCheckout)

module.exports = router;
