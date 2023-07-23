/* const mysql = require('mysql2')


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: '14789'
})


module.exports = pool.promise() // to be able to use promise to get data */

const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "14789", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;