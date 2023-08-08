const Product = require("../models/product");
const mongodb = require("mongodb");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });

  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  // res.sendFile(path.join(__dirname, '..', 'views', 'add-product.html'));
}; // 

exports.getProducts = (req, res, next) => {
  /* Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  }); */

  /*  Sequelize
 req.user
    .getProducts()
    // Product.findAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((error) => {
      console.log(error);
    }); */

  Product.find({userId: req.user._id})
    // .select('title -price')
    // .populate('userId', 'name')
    .then((products) => {
      console.log(products);
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;

  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    description: description,
    price: price,
    userId: req.user._id // or just req.user 'cause mongoose automatically assigns _id to userId
  });

  /* MongoDB implementation
  const product = new Product(
    title,
    imageUrl,
    description,
    price,
    null,
    req.user._id
  ); */

  product
    .save()
    .then((result) => {
      console.log("Created product");
      // console.log(result);
      res.redirect("/admin/products");
    })
    .catch((error) => {
      console.log(error);
    });

  /* Sequelize
  req.user.createProduct({
    title: title,
    imageUrl: imageUrl,
    description: description,
    price: price,
  })
    .then((result) => {
      console.log("Created product");
      res.redirect("/admin/products");
    })
    .catch((error) => {
      console.log(error);
    });
 */
  /* const product = new Product(null, title, imageUrl, description, price);
  product
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err)); */
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productId;
  /* Sequelize
  req.user
    .getProducts({ where: { id: prodId } })
    // Product.findByPk(prodId)
    .then((products) => {
      if (!products[0]) return res.redirect("/");
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: products[0],
      });
    })
    .catch((err) => console.log(err)); */

  Product.findById(prodId)
    .then((product) => {
      if (!product) return res.redirect("/");
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()){
        return res.redirect('/')
      }
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.price = updatedPrice;
      product.description = updatedDesc;
      return product.save().then((result) => {
        console.log("Updated product");
        res.redirect("/admin/products");
      });
    })
    .catch((error) => {
      console.log(error);
    });

  /* 
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedDesc,
    updatedPrice
  );
  updatedProduct.save();
  res.redirect("/admin/products"); */

  /* Sequelize
  // Notes that it only changes locally in our app, not in database
  Product.findByPk(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.price = updatedPrice;
      product.description = updatedDesc;
      return product.save(); // method provided by sequelize
    })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((error) => {
      console.log(error);
    }); */
  /* MongoDB 
  const product = new Product(
    updatedTitle,
    updatedImageUrl,
    updatedDesc,
    updatedPrice,
    prodId
  ); */
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  /* Sequelize
  Product.findByPk(prodId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((error) => {
      console.log(error);
    }); */

  Product.deleteOne({ _id: prodId, userId : req.user._id })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((error) => {
      console.log(error);
    });
};
