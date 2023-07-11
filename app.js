const express = require("express");
const app = express();

/* Handlebars template engine

const expressHbs = require("express-handlebars");
app.engine("hbs", expressHbs());
app.set('view engine', 'hbs') 

*/

/* pug template engine 

app.set('view engine', 'pug')
app.set('views', 'views') // where to find  

*/

app.set('view engine', 'ejs');
app.set('views', 'views'); 

// Controllers 
const errorController = require('./controllers/error')

// Path
const path = require("path");

// Body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}))

// public folder
app.use(express.static(path.join(__dirname, "public")))

// Router
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
app.use('/admin', adminRoutes);
app.use(shopRoutes);


// Not found page
app.use(errorController.get404)

app.listen(4000)
/* Vanilla NodeJS

const routes = require("./routes");

console.log(routes.someText);
const server = http.createServer(routes.handler); // return server instance

server.listen(4000);
 
*/