const express = require("express");
const router = express.Router();

// models

const User = require("../models/user");

// middlewares

const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  console.log("Hello User");
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
