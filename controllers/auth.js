const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  // const isLoggedIn =
  //   req.get("Cookie")?.split(";")[3].trim().split("=")[1] === "true";
  const isLoggedIn = req.session.isLoggedIn;
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  // req.isLoggedIn = true  --> result in problem which is noted in Udemy
  // res.setHeader("Set-Cookie", "loggedIn=true");
  // req.session.isLoggedIn = true;
  // res.redirect("/");
  User.findById("64c1dd1dc50fc4332351c848")
  .then((user) => {
    req.session.isLoggedIn = true;
    req.session.user = user
    // To make sure that the res.redirect is done after creating the session
    req.session.save((err) => {
      console.log(err)
      res.redirect("/");
    } )
  })
  .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  })
}
