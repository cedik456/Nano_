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
    return bcrypt
      .compare(req.body.password, user1.password)
      .then((result) => {
        if (!result) {
          return res.status(401).json({
            message: "Auth Failed",
          });
        }
        const token = jwt.sign(
          { email: user1.email, userId: user1._id },
          "A_very_long_string_for_our_secret",
          { expiresIn: "1h" }
        );

        res.json({
          token: token,
          expiresIn: 3600,
          userId: user1._id,
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
      const NewUser = User({
        email: req.body.email,
        password: hash,
      });
      NewUser.save().then((result) => {
        res.status(201).json({
          message: "User created",
          result: result,
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
