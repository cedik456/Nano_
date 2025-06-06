const express = require("express");

const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");

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
  checkAuth,
  multer({ storage: storage }).single("image"),
  async (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const { title, content } = req.body;
    const imagePath = url + "/images/" + req.file.filename;
    const creator = req.userData.userId;

    try {
      const post = await Post.create({ title, content, imagePath, creator });
      res.status(200).json({
        message: "Post added successfully",
        post: {
          ...post._doc,
          id: post._id,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Creating A Post Failed!",
      });
    }
  }
);

router.get("/", (req, res) => {
  const PageSize = +req.query.pagesize;
  const CurrentPage = +req.query.currentpage;
  const postquery = Post.find();
  let fetchedPosts; // Declare fetchedPosts here

  if (PageSize && CurrentPage) {
    postquery.skip(PageSize * (CurrentPage - 1)).limit(PageSize);
  }

  postquery
    .then((documents) => {
      fetchedPosts = documents; // Assign documents to fetchedPosts
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: fetchedPosts, // Use fetchedPosts here
        maxPosts: count,
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching posts failed!" });
    });
});

router.get("/:id", (req, res, next) => {
  try {
    Post.findById(req.params.id).then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(484).json({ message: "Post not Found!" });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Fecching Posts Failed!",
    });
  }
});

router.delete("/:id", checkAuth, (req, res) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Delete successful!" });
      } else {
        res.status(401).json({ message: "Not Authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Deleting post failed!" });
    });
});

// app.use((req, res) => {
//   res.send("Hello from expressJs");
// });

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }

    const updatedPost = {
      title,
      content,
      imagePath,
      creator: req.userData.userId, // ✅ Important to secure update!
    };

    try {
      const result = await Post.updateOne(
        { _id: id, creator: req.userData.userId }, // ✅ Match post + creator
        updatedPost
      );

      if (result.matchedCount > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not Authorized!" });
      }
    } catch (error) {
      console.error("Update Error:", error);
      res.status(500).json({ message: "Could not update post!" });
    }
  }
);

module.exports = router;
