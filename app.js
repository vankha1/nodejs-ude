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

app.set("view engine", "ejs");
app.set("views", "views");

// CSRF token
const csrf = require('csurf')
const csrfProtection = csrf()


// Connect-flash
const flash = require('connect-flash')

/* // Database SQL

const sequelize = require("./util/database");
const Product = require("./models/product")
const User = require("./models/user")
const Cart = require("./models/cart")
const CartItem = require("./models/cart-item")
const Order = require("./models/order")
const OrderItem = require("./models/order-item")

 */

/* MongoDB connection
const mongoConnect = require("./util/database").mongoConnect;
const User = require("./models/user"); */

// Mongoose connection
const mongoose = require("mongoose");
const User = require("./models/user");
const MONGODB_URI = "mongodb+srv://vovankha2003:vovankha2003@cluster0.e5aa9am.mongodb.net/shop"

// Session 
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
})
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}));


app.use((req, res, next) => {
  /* // Sequelize
  User.findByPk(1)
    .then((user) =>{
      req.user = user
      next()
    })
    .catch((err) => console.log(err))
   */
  
  // MongoDB and mongoose
  if (!req.session.user){
    return next()
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user){
        return next()
      }
      req.user = user
      next();
    })
    .catch((err) => {
      throw new Error(err)
    });
});

// Controllers
const errorController = require("./controllers/error");

// Path
const path = require("path");

// Body parser
const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// public folder
app.use(express.static(path.join(__dirname, "public")));

app.use(csrfProtection)

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(flash());

// Router
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// Handling errors
app.get('/500', errorController.get500)

// Not found page
app.use(errorController.get404);


// Handling errors using next()
app.use((error, req, res, next) => {
  res.redirect('/500')
})

mongoose
  .connect(
    MONGODB_URI
  )
  .then((result) => {
    /*  User.findOne().then((user) => {
      if(!user){
        const user = new User({
          name: "van kha",
          email: "vankha2003@gmail.com",
          cart : {
            items: []
          }
        })
        user.save()
      }
    }) */
    
    app.listen(4000);
  })
  .catch((err) => console.log(err));

/* 

mongoConnect(() => {
  app.listen(4000)
}) */

/* SQL Connection
// onDelete : 'CASCADE' -> if we delete a user, any price related to the user will be removed
Product.belongsTo(User, { constraints : true, onDelete : 'CASCADE' })
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, { through: CartItem }) // a cart can contain many products
Product.belongsToMany(Cart, { through: CartItem }) // a product can be in many carts
// Product and Cart join through in-between table named CartItem 
Order.belongsTo(User)
User.hasMany(Order) // one - to - many relationship
Order.belongsToMany(Product, { through: OrderItem })


// User.sync() - Sẽ tạo bảng nếu bảng không tồn tại và không làm gì nếu ngược lại
// User.sync({ force: true }) - Xóa bảng đã tồn tại và tạo ra bảng mới
sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    return User.findByPk(1)
  })
  .then(user => {
    if (!user) {
      return User.create({name: 'Kha', email: 'test@gmail.com'})
    }
    return user
  })
  .then((user) => {
    return user.createCart()
  })
  .then(() => {
    // console.log(user)
    app.listen(4000);
  })
  .catch((error) => {
    console.log(error);
  });
 */

/* Vanilla NodeJS

const routes = require("./routes");

console.log(routes.someText);
const server = http.createServer(routes.handler); // return server instance

server.listen(4000);
 
*/
