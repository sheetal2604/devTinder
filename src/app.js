const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validate");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

// middleware to parse JSON request bodies
app.use(express.json());
app.use(cookieParser());

//POST signup route

app.post("/signup", async (req, res) => {
  //validate the request body

  try {
    validateSignupData(req);
    // encrypt the password by using bcrypt library

    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    // create a new instance of User model

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    // save the user to the database
    // since save() is an async operation and always returns a promise , use async await to handle this
    //Error handling

    await user.save();
    res.send("User added successfully!!");
  } catch (err) {
    res.status(400).send("Error adding user: " + err.message);
  }
});

// login route

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    } else {
      const token = await jwt.sign({ _id: user._id }, "DEV@TINDER!234", {
        expiresIn: "1d",
      });
      res.cookie("token", token, { expires: "1d" });
      res.status(200).send("Login Successfully!!");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// GET Profile

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//DB Connection
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("server is running on port 3000");
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });
