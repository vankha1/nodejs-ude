const mysql = require('mysql2')


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: '14789'
})


module.exports = pool.promise() // to be able to use promise to get data
