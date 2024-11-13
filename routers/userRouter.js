const { Router } = require("express");
const userModel = require("../models/user");
const router = Router();
const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
  destination :function(req , file , cb){
      cb(null , path.resolve(`./public/images/`))
  },
  filename : function (req, file , cb){
      const fileName = `${Date.now()}${file.originalname}`;
      cb(null , fileName)
  }
});

const upload = multer({ storage : storage});

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
      error : "Incorrect Email or Password",
    });
  }

  return res.cookie("token", token).redirect("/");
});

// Create User
router.post("/signup",upload.single("profileImage"), async (req, res) => {
  const { fullName, email, password } = req.body;
  
  

  await userModel.create({
    fullName,
    email,
    password,
    profileImageURL :  `images/${req.file.filename}`
  });
  console.log("User created");

  // console.log(userModel);

  return res.redirect("/");
});

router.get("/logout" ,(req , res)=>{
  console.log("Logout method");
  
    res.clearCookie("token").redirect("/");
})

module.exports = router;
