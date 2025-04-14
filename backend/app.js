const express = require("express");

// mongo db
const mongoose = require("mongoose");

const post = require("./routes/post");
const user = require("./routes/user");

const app = express();
const bodyParser = require("body-parser");

const path = require("path");

const cors = require("cors");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/images", express.static(path.join("backend/images")));

app.use(cors());

// Connect db

mongoose
  .connect(
    "mongodb+srv://Angular2:sQbMPNWUzgKdRHkU@angular2.xeox6.mongodb.net/?retryWrites=true&w=majority&appName=Angular2"
  )
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch(() => {
    console.log("Error fetching database");
  });

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  next();
});

app.use("/api/posts", post);
app.use("/api/user", user);

module.exports = app;
