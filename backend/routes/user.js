const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("Hello User");
});

router.post("/signup", (req, res) => {});

module.exports = router;
