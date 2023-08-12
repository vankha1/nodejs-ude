const express = require("express");

const { check, body } = require("express-validator");
const User = require("../models/user");
const router = express.Router();
const authController = require("../controllers/auth");

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.get("/reset", authController.getReset);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    body("password")
      .isAlphanumeric()
      .isLength({ min: 5 })
      .withMessage("Invalid password")
      .trim(),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  // all of first parameters are input's name attribute
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        // if (value === "test@gmail.com") {
        //   throw new Error("This email is forbidden");
        // }
        // return true;
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email exists, please pick another one.");
          }
        });
      })
      .normalizeEmail(),
    body("password", "Password with numbers and text and at least 5 characters")
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.post("/reset", authController.postReset);

// must be :token, because in auth controller we have const token = req.params.token;
router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
