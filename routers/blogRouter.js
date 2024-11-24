const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog");
const Comment = require("../models/comments");
const { uploadToCloudinary,cloudinary } = require("../Utils/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const router = Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    // Folder name in your Cloudinary account
    allowed_formats: ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "tiff"], // Allowed file types
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
  // console.log(blog);

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
