const express = require("express");


// mongo db
const mongoose = require("mongoose");

// Models
const post = require("./routes/post")
const app = express();
const bodyParser = require("body-parser");

const cors = require("cors");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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


// app.get("/", (req, res) => {
//   res.send("This is the homepage");
// });

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*"),
//     res.setHeader(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept"
//     );

//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, PATCH, DELETE, OPTIONS"
//   );

//   next();
// });

// app.post("/api/posts", async (req, res, next) => {
//   const { title, content } = req.body;

//   try {
//     const post = await Post.create({ title, content });
//     res.status(200).json({
//       message: 'Post added successfully',
//       postId: post._id
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// app.get("/api/posts", (req, res) => {
//   Post.find().then((documents) => {
//     res.status(200).json({
//       message: "Post successfully",
//       posts: documents,
//     });
//   });

//   //   next();
// });

// app.get("/api/posts/:id",(req, res, next)=>{  
//   Post.findById(req.params.id).then(post =>{  
//       if(post){  
//         res.status(200).json(post);  
//       }else{  
//         res.status(484).json({message: 'Post not Found!'});  
//       }  
//     });  
// }); 

// app.delete("/api/posts/:id", (req, res) => {
//   Post.deleteOne({ _id: req.params.id }).then((result) => {
//     console.log(result);
//     console.log(req.params.id);
//     res.status(200).json({ message: "Post deleted" });
//   });
// });

// // app.use((req, res) => {
// //   res.send("Hello from expressJs");
// // });

// app.put("/api/posts/:id", async (req, res) => {
//   const { id } = req.params;
//   const { title, content } = req.body;

//   try {
//     const result = await Post.updateOne({ _id: id }, { title, content });
//     if (result.modifiedCount > 0) {
//       res.status(200).json({ message: "Update successful!" });
//     } else {
//       res.status(404).json({ message: "Post not found!" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Could not update post!" });
//   }
// });

app.use("/api/posts", post);

module.exports = app;
