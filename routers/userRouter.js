const { Router } = require("express");
const userModel = require("../models/user");
const router = Router();
const multer = require("multer");
const path = require("path");
const { uploadToCloudinary,upload } = require("../Utils/cloudinary");






router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

// Login User
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await userModel.matchPasswordAndGenerateToken(
      email,
      password
    );
  } catch (error) {
    return res.render("signup", {
      error: "Incorrect Email or Password",
    });
  }

  return res.cookie("token", token).redirect("/");
});

// Create User

router.post("/signup", upload.single("profileImage"), async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    console.log("FILE PATH ------------->  ",req.file.path);

    // const profileImgUrl = req.file.path;
    const url = await uploadToCloudinary(req.file.path)
    console.log("URL---------------> ",url);
    
    const u = await userModel.create({
      fullName,
      email,
      password,
      profileImageURL: url,
    });
    console.log("User created");

    console.log(u);
  } catch (error) {
    console.log(error.message);

    throw error;
  }
  return res.redirect("/");
});

router.get("/logout", (req, res) => {
  console.log("Logout method");

  res.clearCookie("token").redirect("/");
});

module.exports = router;
