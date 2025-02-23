const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("This is the homepage");
});

app.use("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "asdasdasdas",
      title: "first title",
      content: "first content from server side",
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
