require("dotenv").config();
const express = require("express")
const path  = require("path")
const cookieParser = require("cookie-parser")
const { checkForAuthenticationCookie } = require("./middlewares/authenticateRequest")
const Blog = require("./models/blog")
const mongoose = require("mongoose");

// DB CONFIG

const { MONGO_URI } = process.env;

const connect = async () => {
  try {
    const connection = await mongoose.connect(`${MONGO_URI}`);
    console.log(
      `success connected : ${connection.connection.host}`
    );
  } catch (error) {
    console.log(`Error while Connecting to Database ${error.message}`);
    
    
  }
};

const userRoutes = require("./routers/userRouter")
const blogRoutes = require ("./routers/blogRouter")

const app = express();

// 
app.set("view engine" , "ejs");
app.set("views" , path.resolve("./views"))

// MIDDILWARES
app.use(express.urlencoded({extended :false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));



app.get("/", async(req,res)=>{
  const allBlogs = await Blog.find({});
  // sort('createdAt' , )


    res.render("home",{
      
      user:  req.user,
      blogs : allBlogs

    });
});

// All Routes
app.use('/user',userRoutes);
app.use('/blog' ,blogRoutes)

const PORT = process.env.PORT || 8000;
connect();
app.listen(PORT , ()=>console.log(`Application stated on PORT: ${PORT} :  http://localhost:${PORT}`));


