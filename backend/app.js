const express = require("express");

const app = express();

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

app.post("/api/posts", (req, res, next) => {
  const post = req.params.title;
  console.log(post);

  res.status(201).json({
    message: "Post added successfully",
  });
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
