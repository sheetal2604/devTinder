const mongoose = require("mongoose");
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
        if (value.indexOf("@") === -1)
          throw new Error("Email must contain '@' symbol");
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
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
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
