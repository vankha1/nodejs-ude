const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const stripe = require("stripe")('sk_test_51NlB5AGMiqvxA792EZ7nn3JvsKh8ykAYmJBIUdV1qgKw3UYbyrLdaVElDjbpiFAv3ogTjeoLyVa8z9Mk1kwHPAqs008hxT0oag');

const Product = require("../models/product");
const Order = require("../models/order");
const product = require("../models/product");
// const Cart = require("../models/cart");

const ITEMS_PER_PAGE = 1;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1; // Must be query.page because we defined href='/?page='
  let totalItems;

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
        currentPage: page,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const errors = new Error(err);
      // console.log(errors);
      errors.httpStatusCode = 500;
      return next(errors);
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
      const errors = new Error(err);
      errors.httpStatusCode = 500;
      return next(errors);
    });
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1; // Must be query.page because we defined href='/?page='
  let totalItems;

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        currentPage: page,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const errors = new Error(err);
      errors.httpStatusCode = 500;
      return next(errors);
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
      const errors = new Error(err);
      errors.httpStatusCode = 500;
      return next(errors);
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
      const errors = new Error(err);
      errors.httpStatusCode = 500;
      return next(errors);
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
      const errors = new Error(err);
      errors.httpStatusCode = 500;
      return next(errors);
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
      const errors = new Error(error);
      errors.httpStatusCode = 500;
      return next(errors);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your orders",
        orders: orders,
      });
    })
    .catch((err) => {
      const errors = new Error(err);
      errors.httpStatusCode = 500;
      return next(errors);
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
  let products;
  let total = 0;
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      // console.log(user);
      products = user.cart.items;
      total = 0;
      products.forEach((product) =>{
        total += product.quantity * product.productId.price;
      })

      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: products.map(p => {
          return {
            quantity: p.quantity,
            price_data: {
              currency: "usd",
              unit_amount: p.productId.price * 100,
              product_data: {
                name: p.productId.title,
                description: p.productId.description,
              },
            },
          }
        }),
        customer_email: req.user.email,
        success_url : req.protocol + '://' + req.get('host') + '/checkout/success', // http://localhost:4000
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel' 
      })
    })
    .then((session) => {
      res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Your checkout",
        products: products,
        totalSum : total,
        sessionId : session.id
      });
    })
    .catch((err) => {
      const errors = new Error(err);
      errors.httpStatusCode = 500;
      return next(errors);
    });
};

exports.getCheckoutSuccess = () => {
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
      const errors = new Error(err);
      errors.httpStatusCode = 500;
      return next(errors);
    });
}

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No one found !!!"));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized"));
      }
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(30).text("Invoice", {
        underline: true,
      });
      pdfDoc.text("-----------");
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(20)
          .text(
            prod.product.title +
              " - " +
              prod.quantity +
              " x " +
              " $" +
              prod.product.price
          );
      });

      pdfDoc.text("-------------");
      pdfDoc.text(totalPrice);

      pdfDoc.end();

      /* Just for tiny file
      fs.readFile(invoicePath, (err, data) => {
        if (err) {
          return next(err);
        }
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          'inline; filename="' + invoiceName + '"'
        );
        res.send(data);
      }); */

      /* const file = fs.createReadStream(invoicePath)
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
      );
      fs.pipe(res) */
    })
    .catch((err) => next(err));
};
