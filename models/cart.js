const fs = require("fs");
const path = require("path");

// pathToData = /data/products.json
const pathToData = path.join(
  path.dirname(require.main.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(pathToData, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent)
      }
      // Analyze the cart => Find existing products
      const existingProductIndex = cart.products?.findIndex(product => product.id === id);
      const existingProduct = cart.products[existingProductIndex];
      console.log(existingProduct);
      let updatedProduct;
      // Add new product / increase quantity
      if (existingProduct) {
        updatedProduct = {...existingProduct}
        updatedProduct.quantity += 1;
        cart.products = [...cart.products]
        cart.products[existingProductIndex] = updatedProduct
      }
      else {
        updatedProduct = { id: id, quantity: 1}
        cart.products = [...cart.products, updatedProduct]
      }
      cart.totalPrice += +productPrice // + is used to convert into number
      fs.writeFile(pathToData, JSON.stringify(cart), (err) => {
        console.log(err)
      })
    });
  }

  static deleteProduct(id, productPrice){
    fs.readFile(pathToData, (err, fileContent) => {
      if (err) {
        return 
      }
      const updatedCart = {...JSON.parse(fileContent)}
      const product = updatedCart.products.filter(prod => prod.id === id)
      if (!product) return;
      const productQty = product.quantity
      updatedCart.products = updatedCart.products.filter(prod => prod.id !== id)
      updatedCart.totalPrice -= productQty * productPrice
      fs.writeFile(pathToData, JSON.stringify(updatedCart), (err) => {
        console.log(err)
      })
    })
  }

  static getCart(callback) {
    fs.readFile(pathToData, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err){
        callback(null)
      }
      else {
        callback(cart)
      }
    })
  }
};
