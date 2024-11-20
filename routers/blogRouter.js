const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog");
const Comment = require("../models/comments");
const { uploadToCloudinary } = require("../Utils/cloudinary");
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

// ADD BLOG
router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blogImageUrl = await uploadToCloudinary(req.file.path);

  const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageURL: blogImageUrl,
  });
  console.log(blog);

  return res.redirect("/");
});

// GET BLOG By ID
router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  // console.log(blog);
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  return res.render("viewBlog", {
    user: req.user,
    blog,
    comments,
  });
});

// ADD Comment
router.post("/comment/:blogId", async (req, res) => {
  const comment = Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });

  return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;
