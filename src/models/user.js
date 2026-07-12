const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 30,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Email is invalid");
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value))
          throw new Error("Password is not strong enough");
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value))
          throw new Error("Gender must be male, female or other");
      },
    },
    about: {
      type: String,
      default: "Hey there! I am using DevTinder",
      trim: true,
      maxLength: 100,
    },
    skills: {
      type: [String],
      max: 10,
    },
    photoURL: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Photo URL is invalid");
        }
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@TINDER!234", {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInput) {
  const user = this;
  const passwordHash = user.password;
  const isValidPassword = await bcrypt.compare(passwordInput, passwordHash);
  return isValidPassword;
};

module.exports = mongoose.model("User", userSchema);
