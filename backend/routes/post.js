const express = require("express");

const Post = require("../models/post");

const router = express.Router();
const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");
    if (isValid) {
      error = null;
    }
    cb(null, "backend/images");
  },

  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("_");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

// router.get("/", (req, res) => {
//   res.send("This is the homepage");
// });

router.post(
  "/",
  multer({ storage: storage }).single("image"),
  async (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const { title, content } = req.body;
    const imagePath = url + "/images/" + req.file.filename;
    try {
      const post = await Post.create({ title, content, imagePath });
      res.status(200).json({
        message: "Post added successfully",
        post: {
          ...post._doc,
          id: post._id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
);

router.get("/", (req, res) => {
  Post.find().then((documents) => {
    res.status(200).json({
      message: "Post successfully",
      posts: documents,
    });
  });

  //   next();
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(484).json({ message: "Post not Found!" });
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

router.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    let imagePath = req.body.imagePath; // Default to the existing imagePath
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename; // Update with the new image path
    }

    try {
      const result = await Post.updateOne(
        { _id: id },
        { title, content, imagePath }
      );
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    } catch (error) {
      res.status(500).json({ message: "Could not update post!" });
    }
  }
);

module.exports = router;
