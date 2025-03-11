const express = require("express");

// mongo db

const mongoose = require("mongoose");

// Models
const Post = require("./models/post");

const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

app.get("/", (req, res) => {
  res.send("This is the homepage");
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"),
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );

  next();
});

app.post("/api/posts", async (req, res, next) => {
  const { title, content } = req.body;

  try {
    const post = await Post.create({ title, content });
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
  }
});

app.use("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "asdasdasdas",
      title: "first title",
      content: "first content from server side",
    },
    {
      id: "asdasdasdasdasdas",
      title: "first asdadastitle",
      content: "first csadasdaontent from server side",
    },
  ];

  res.status(200).json({
    message: "Post successfully fetched",
    posts: posts,
  });
  //   next();
});

// app.use((req, res) => {
//   res.send("Hello from expressJs");
// });

module.exports = app;
