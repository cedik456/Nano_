const express = require("express");
const router = express.Router();

// models

const User = require("../models/user");

// middlewares

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  console.log("Hello User");
});

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }).then((user1) => {
    if (!user1) {
      return res.status(401).json({
        message: "Auth Failed",
      });
    }
    let fetchedUser = user1;
    return bcrypt
      .compare(req.body.password, fetchedUser.password)
      .then((result) => {
        if (!result) {
          return res.status(401).json({
            message: "Auth Failed",
          });
        }
        const token = jwt.sign(
          { email: fetchedUser.email, userId: fetchedUser._id },
          "A_very_long_string_for_our_secret",
          { expiresIn: "1h" }
        );

        res.json({
          token: token,
          expiresIn: 3600,
          userId: fetchedUser._id,
          email: fetchedUser.email,
        });
      })
      .catch((err) => {
        return res.status(401).json({
          message: "Auth Failed",
        });
      });
  });
});

router.post("/signup", (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const newUser = new User({
        email: req.body.email,
        password: hash,
      });
      // return this promise so its errors bubble to the next .catch()
      return newUser.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "User created",
        result,
      });
    })
    .catch((err) => {
      // Mongo duplicate-key error code
      if (err.code === 11000 && err.keyPattern?.email) {
        return res.status(409).json({ message: "Email already in use." });
      }
      console.error("Signup error:", err);
      res.status(500).json({ message: "Invalid authentication credentials!" });
    });
});

module.exports = router;
