const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { timeStamp } = require("console");
const { createTokenForUser } = require("../Utils/authentication");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/default.png",
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return;

  const salt = await randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  next();
});

userSchema.static('matchPasswordAndGenerateToken' , async function(email ,password){
    const user = await this.findOne({email});
    if(!user) throw new Error("User not found!");

    const salt = user.salt;
    const hashedPassword = user.password

    const userProvidedHash =  createHmac("sha256" ,salt)
    .update(password).digest("hex");

    if(hashedPassword !==userProvidedHash) throw new Error('Incorrect Password')
    // console.log("Inside ",user);
    
    token = createTokenForUser(user);
    return token;
})

module.exports = model("User", userSchema);