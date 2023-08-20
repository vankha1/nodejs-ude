const express = require("express");
const path = require("path");
const { body } = require("express-validator");

// Config path
// const rootDir = require('../util/path');

// Controller
const adminController = require("../controllers/admin");

// Middleware
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);
// admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// // admin/product => POST
router.post(
  "/product",
  [
    body("title")
        .isString()
        .isLength({ min: 3 })
        .trim(),
    body("description")
        .isLength({ min: 5, max: 200 })
        .trim(),
    body("price").isFloat(),
  ],
  isAuth,
  adminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    body("title")
        .isString()
        .isLength({ min: 3 })
        .trim(),
    body("description")
        .isLength({ min: 5, max: 200 })
        .trim(),
    body("price").isFloat(),
  ],
  isAuth,
  adminController.postEditProduct
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
