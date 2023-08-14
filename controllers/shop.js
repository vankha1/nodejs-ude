const Product = require("../models/product");
const Order = require("../models/order");
// const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
      });
    })
    .catch((err) => {
      const errors = new Error(err)
      errors.httpStatusCode = 500
      return next(errors)
    });

  /* Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Shop",
      path: "/products",
    });
  }); */

  /* MySQL manual implementation
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "Shop",
        path: "/products",
      });
    })
    .catch((err) => console.error(err)); */

  /* MongoDB
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
      });
    })
    .catch((err) => console.error(err)); */

  /* console.log(path.join(__dirname)); /NodeJS/routes
  res.sendFile(path.join(rootDir, 'views', 'shop.html')); // we can also use path.resolve('views', 'shop.html') */
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  /* Product.findById(prodId, (product) => {
    res.render("shop/product-detail", {
      product,
      pageTitle: product.title,
      path: "/products",
    });
  }); */

  /* MySQL manual
    Product.findById(prodId)
    .then(([product]) => {
      res.render("shop/product-detail", {
        // because we always view details of a product --> product[0]
        product: product[0],
        pageTitle: product[0].title,
        path: "/products",
      });
    })
    .catch((err) => console.error(err)); */

  /* Sequelize
    Product.findByPk(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.error(err)); */

  /* findAll + where = findByPk, but findAll return an array.
    Product.findAll({where : {id : prodId}})
    .then(products => {
      res.render("shop/product-detail", {
        product: products[0],
        pageTitle: products[0].title,
        path: "/products",
      })
    })
    .catch((err) => console.error(err)); 
    */

  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      const errors = new Error(err)
      errors.httpStatusCode = 500
      return next(errors)
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/"
      });
    })
    .catch((err) => {
      const errors = new Error(err)
      errors.httpStatusCode = 500
      return next(errors)
    });

  /* Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  }); */

  /* MySQL manual implementation
    Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/index", {
        prods: rows, // rows = products
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.error(err)); */

  /* MongoDB
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.error(err)); */
};

exports.getCart = (req, res, next) => {
  /* Manually
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({
            productData: product,
            quantity: cartProductData.quantity,
          });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
      });
    });
  }); */
  /* Sequelize
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: products,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err)); */

  req.user
    .populate("cart.items.productId")
    .then((user) => {
      // console.log(user);
      const products = user.cart.items;
      // console.log(products);
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => {
      const errors = new Error(err)
      errors.httpStatusCode = 500
      return next(errors)
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  /* Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
    res.redirect("/cart");
  }); */

  /* Sequelize
  let fetchedCart;
  let newQuantity = 1;

  req.user.getCart().then((cart) => {
    fetchedCart = cart;

    return cart
      .getProducts({ where: { id: prodId } })
      .then((products) => {
        let product;
        if (products.length > 0) {
          product = products[0];
        }
        if (product) {
          // we want to add to cart a product which exists in the cart
          const oldQuantity = product.cartItem.quantity;
          newQuantity = oldQuantity + 1;
          return product;
        }
        return Product.findByPk(prodId);
      })
      .then((product) => {
        return fetchedCart.addProduct(product, {
          through: { quantity: newQuantity },
        });
      })
      .then(() => {
        res.redirect("/cart");
      })
      .catch((err) => console.log(err));
  }); */

  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      // console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      const errors = new Error(err)
      errors.httpStatusCode = 500
      return next(errors)
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  /* Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  }); */

  /* Sequelize
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err)); */

  req.user
    .deleteItemFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const errors = new Error(err)
      errors.httpStatusCode = 500
      return next(errors)
    });
};

exports.postOrder = (req, res, next) => {
  /* Sequelize   
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.error(err));
    })
    .then((result) => {
      // clean up the cart after ordering
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err)); */

    req.user
    .populate("cart.items.productId")
    .then((user) => {
      // 'cause user items have product's id which doesn't exist in model Order, we need to map user.cart.items to get quantity and product.
      const products = user.cart.items.map((item) => {
        return { quantity: item.quantity, product: { ...item.productId._doc } };
      });
      // console.log(user.cart.items);
      const order = new Order({
        products: products,
        user: {
          email: req.user.email,
          userId: req.user._id,
        },
      });
      return order.save();
    })
    .then((result) => {
      req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const errors = new Error(error)
      errors.httpStatusCode = 500
      return next(errors)
    });
};

exports.getOrders = (req, res, next) => {
  Order
    .find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your orders",
        orders: orders,
      });
    })
    .catch((err) => {
      const errors = new Error(err)
      errors.httpStatusCode = 500
      return next(errors)
    });

  /* Sequelize 
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      // console.log(orders); // include property named products
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err)); */

  /* MongoDB
  req.user
    .getOrders()
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err)); */
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Your Checkout",
  });
};
