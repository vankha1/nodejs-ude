const fs = require("fs");
const path = require("path");

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
  constructor(title) {
    this.title = title;
  }

  save() {    
    // when we call function getProductsFromFileAndParse, we have parsed the data. Therefore, the callback in this function will be pushing data, stringifying it and writing it to file.
    getProductsFromFileAndParse((products) => {
      products.push(this);
      fs.writeFile(pathToData, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(callback) {
    getProductsFromFileAndParse(callback);
  }
};
