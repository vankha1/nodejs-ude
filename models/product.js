const fs = require("fs");
const path = require("path");

const Cart = require('../models/cart')

// pathToData = /data/products.json
const pathToData = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);
// This function receive a callback
const getProductsFromFileAndParse = (callback) => {
  // Read the file following a path, if file doesn't exist, create a new one
  fs.readFile(pathToData, (err, fileContent) => {
    if (err) {
      callback([]);
    } else {
      callback(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {    
    // when we call function getProductsFromFileAndParse, we  parsed the data. Therefore, the callback in this function will be pushing data, stringifying it and writing it to file.
    getProductsFromFileAndParse((products) => {
      if (this.id){
        // editing
        const existingProductIndex = products.findIndex(prod => prod.id == this.id)
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(pathToData, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      }
      else {
        // create new product
        this.id = Math.random().toString();
        products.push(this);
        
        fs.writeFile(pathToData, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }


  static deleteById(id) {
    getProductsFromFileAndParse((products) => {
      const product = products.find(p => p.id === id)
      const updatedProducts = products.filter(prod => prod.id !== id);
      fs.writeFile(pathToData, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price)
        }
      })
    })
  }

  static fetchAll(callback) {
    getProductsFromFileAndParse(callback);
  }

  static findById(id, callback) {
    getProductsFromFileAndParse(products => {
      const product = products.find(prod => prod.id === id);
      callback(product);
    })
  }
};
