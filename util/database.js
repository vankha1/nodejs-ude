/* const mysql = require('mysql2')


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: '14789'
})


module.exports = pool.promise() // to be able to use promise to get data */

/* SQL
 const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "14789", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize; */

const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://vovankha2003:vovankha2003@cluster0.e5aa9am.mongodb.net/shop?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("Connected !!!!");
      _db = client.db()
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};


const getDb = () => {
  if (_db) {
    return _db // database instance
  }
  throw "No database connection"
}

module.exports.mongoConnect = mongoConnect
module.exports.getDb = getDb