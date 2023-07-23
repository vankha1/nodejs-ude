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

// Database
const sequelize = require("./util/database");
const Product = require("./models/product")
const User = require("./models/user")
const Cart = require("./models/cart")
const CartItem = require("./models/cart-item")
const Order = require("./models/order")
const OrderItem = require("./models/order-item")


app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) =>{
      req.user = user
      next()
    })
    .catch((err) => console.log(err))
})

// Controllers
const errorController = require("./controllers/error");

// Path
const path = require("path");

// Body parser
const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// public folder
app.use(express.static(path.join(__dirname, "public")));

// Router
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
app.use("/admin", adminRoutes);
app.use(shopRoutes);

// Not found page
app.use(errorController.get404);

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

/* Vanilla NodeJS

const routes = require("./routes");

console.log(routes.someText);
const server = http.createServer(routes.handler); // return server instance

server.listen(4000);
 
*/
