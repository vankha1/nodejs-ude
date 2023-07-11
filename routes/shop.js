const express = require('express');
// const path = require('path');
const { log } = require('console');

// const rootDir = require('../util/path');
const router = express.Router();

// Controller 
const productController = require('../controllers/products')


router.get('/', productController.getProducts)

module.exports = router;
