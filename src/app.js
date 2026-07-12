const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validate");
const bcrypt = require("bcrypt");

// middleware to parse JSON request bodies
app.use(express.json());

//get user from DB by emailId
// app.get("/user", async (req, res) => {
//   const userEmail = req.body.emailId;
//   try {
//     const users = await User.find({ emailId: userEmail });
//     if (users.length === 0) {
//       res.status(404).send("User not found");
//     } else {
//       res.send(users);
//     }
//   } catch (err) {
//     res.status(400).send("Error fetching user: " + err.message);
//   }
// });

//get all users from DB /feed
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("No users found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Error fetching users: " + err.message);
  }
});

//use of findOne() method to get a single user by emailId
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Error fetching user: " + err.message);
  }
});

//Delete a user by using findByIdAndDelete method from DB

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const deletedUser = await User.findByIdAndDelete({ _id: userId });
    if (!deletedUser) {
      res.status(404).send("User not found");
    } else {
      res.send("User deleted successfully!!");
    }
  } catch (err) {
    res.status(400).send("Error deleting user: " + err.message);
  }
});

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
      res.status(200).send("Login Successfully!!");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// PATCH route to update a user by using findByIdAndUpdate method from DB
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  // I dont want the user to update certain fields
  try {
    const ALLOWED_UPDATES = [
      "gender",
      "about",
      "skills",
      "password",
      "photoURL",
    ];
    const isUpdateAllowed = Object.keys(req.body).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );
    if (!isUpdateAllowed) {
      throw new Error("Invalid updates!");
    }
    if (req.body.skills?.length > 10) {
      throw new Error("Skills array cannot have more than 10 skills");
    }
    await User.findByIdAndUpdate({ _id: userId }, req.body, {
      runValidators: true,
    });
    res.send("User updated successfully!!");
  } catch (err) {
    res.status(400).send("Error updating user data: " + err.message);
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
