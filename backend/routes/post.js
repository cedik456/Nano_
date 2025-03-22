const express = require("express");

const Post = require("../models/post");

const router = express.Router();


// router.get("/", (req, res) => {
//   res.send("This is the homepage");
// });


router.post("/", async (req, res, next) => {
  const { title, content } = req.body;

  try {
    const post = await Post.create({ title, content });
    res.status(200).json({
      message: 'Post added successfully',
      postId: post._id
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/", (req, res) => {
  Post.find().then((documents) => {
    res.status(200).json({
      message: "Post successfully",
      posts: documents,
    });
  });

  //   next();
});

router.get("/:id",(req, res, next)=>{  
  Post.findById(req.params.id).then(post =>{  
      if(post){  
        res.status(200).json(post);  
      }else{  
        res.status(484).json({message: 'Post not Found!'});  
      }  
    });  
}); 

router.delete("/:id", (req, res) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    console.log(req.params.id);
    res.status(200).json({ message: "Post deleted" });
  });
});

// app.use((req, res) => {
//   res.send("Hello from expressJs");
// });

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const result = await Post.updateOne({ _id: id }, { title, content });
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Could not update post!" });
  }
});


module.exports = router;