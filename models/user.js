const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  // name: {
  //   type: String,
  //   required: true,
  // },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, require: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cart_product) => {
    // console.log(cart_product.productId, '....', product._id);
    return cart_product.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  // console.log(cartProductIndex);
  if (cartProductIndex >= 0) {
    // if the product is already in the cart
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    this.cart.items[cartProductIndex].quantity = newQuantity;
  } else {
    // if the product is not in the cart (which is new)
    this.cart.items.push({
      productId: product._id,
      quantity: 1,
    });
  }

  const updatedCart = { items: this.cart.items };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteItemFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};


userSchema.methods.clearCart = function() {
  this.cart = { items : [] }
  return this.save()
}

module.exports = mongoose.model("User", userSchema);

/* Sequelize
const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  name: Sequelize.STRING,

  email : Sequelize.STRING
}); */

/* // Mongodb manually implement 
const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart; // { items : [products] }
    this._id = id;
  }

  save() {
    const db = getDb();

    return db
      .collection("users")
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cart_product) => {
      // console.log(cart_product.productId, '....', product._id);
      return cart_product.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    console.log(cartProductIndex);
    if (cartProductIndex >= 0) {
      // if the product is already in the cart
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      this.cart.items[cartProductIndex].quantity = newQuantity;
    } else {
      // if the product is not in the cart (which is new)
      this.cart.items.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: 1,
      });
    }

    const updatedCart = { items: this.cart.items };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    const cartProductIds = this.cart.items.map((item) => {
      return item.productId;
    });
    return db
      .collection("products")
      .find({ _id: { $in: cartProductIds } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find((item) => {
              return item.productId.toString() === product._id.toString();
            }).quantity,
          };
        });
      });
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter((item) => {
      return item.productId.toString() !== productId.toString();
    });
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrder() {
    const db = getDb();
    // when the product is changed, the product in the order is not changed
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: new mongodb.ObjectId(this._id),
            name: this.name,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then(() => {
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      })
      .catch((err) => console.log(err));
  }

  getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": new mongodb.ObjectId(this._id) })
      .toArray();
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;
 */
