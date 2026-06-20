const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

//POST signup route

app.post("/signup", async (req, res) => {
  //create a new instance of User model
  const user = new User({
    firstName: "Sheetal",
    lastName: "Katiyar",
    emailId: "sheetal@gmail.com",
    password: "sheetal@123",
  });

  // save the user to the database
  // since save() is an async operation and always returns a promise , use async await to handle this
  //Error handling
  try {
    await user.save();
    res.send("User added successfully!!");
  } catch (err) {
    res.status(400).send("Error adding user: " + err.message);
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
