const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const multerb = require("multer");
const fs = require("fs")
const path = require("path")
// Properly access specific environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME, // Replace with the correct variable name
  api_key: process.env.CLOUDNARY_API_KEY, // Replace with the correct variable name
  api_secret: process.env.CLOUDNARY_SECRET_KEY, // Replace with the correct variable name
});

const uploadToCloudinary = async (localFilePath) => {
  console.log("Upload method called ");

  try {
    if (!localFilePath) return null;
    console.log("file path", localFilePath);
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: "user",
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath)
    return response.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);
    throw error;
  }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/images/`));
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}${file.originalname}`;
      cb(null, fileName);
    },
  });

const upload = multer({ storage: storage });

module.exports = {
    uploadToCloudinary,
    upload,
};
