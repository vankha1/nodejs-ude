const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/user");

const { validationResult } = require('express-validator')

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vovankha2003@gmail.com",
    pass: "fwqfnnbzqwidrzia",
  },
});

exports.getLogin = (req, res, next) => {
  // const isLoggedIn =
  //   req.get("Cookie")?.split(";")[3].trim().split("=")[1] === "true";
  let message = req.flash("error"); // array of flash messages
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
    oldInput : {
      email: '',
      password: '',
    },
    validationErrors :[]
  });
};

exports.postLogin = (req, res, next) => {
  // req.isLoggedIn = true  --> result in problem which is noted in Udemy
  // res.setHeader("Set-Cookie", "loggedIn=true");
  // req.session.isLoggedIn = true;
  // res.redirect("/");
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput : {
        email: req.body.email,
        password: req.body.password,
      },
      validationErrors : errors.array()
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: "Invalid email or password",
          oldInput : {
            email: req.body.email,
            password: req.body.password,
          },
          validationErrors : errors.array()
        });
      }
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            // To make sure that the res.redirect is done after creating the session
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage: "Invalid email or password",
            oldInput : {
              email: req.body.email,
              password: req.body.password,
            },
            validationErrors : errors.array()
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error"); // array of flash messages
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
    oldInput : {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors : []
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput : {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
      },
      validationErrors : errors.array()
    })
  }
  
  return bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
      return transporter.sendMail({
        to: email,
        from: "xuantvt@gmail.com",
        subject: "Signup succeeded",
        html: "<h1>You successfully signed up!</h1>",
      });
    })
    .catch((error) => {
      console.log("error = ", error, "\n");
    });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error"); // array of flash messages
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/reset");
        transporter.sendMail({
          to: req.body.email,
          from: "xuantvt@gmail.com",
          subject: "Password reset",
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:4000/reset/${token}">Link</a></p>
          `,
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() }, // $gt means greater than
  }).then((user) => {
    let message = req.flash("error"); // array of flash messages
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render("auth/new-password", {
      path: "/new-password",
      pageTitle: "New Password",
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token
    });
  }).catch(err => console.log(err))
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password
  const userId = req.body.userId
  const passwordToken = req.body.passwordToken

  let resetUser;
  User.findOne({
    resetToken : passwordToken,
    resetTokenExpiration: {$gt : Date.now()},
    _id: userId
  })
  .then(user => {
    resetUser = user;
    return bcrypt.hash(newPassword, 12)
  })
  .then(hashedPassword => {
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    return user.save()
  }) 
  .then(result => {
    res.redirect('/login');
  })
  .catch(err => console.log(err))
}
