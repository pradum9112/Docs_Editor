const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSignUpSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
        
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Not valid email address");
      }
    },
  },

  password: {
    type: String,
    required: true,
    minlength: 4,
  },

  
  
});

userSignUpSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  next();
});

const SIGNUPNUSER = new mongoose.model("SIGNUPNUSER", userSignUpSchema);

module.exports = SIGNUPNUSER;
