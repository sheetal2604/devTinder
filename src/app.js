const express = require("express");
const { auth, userAuth } = require("./middlewares/auth");
const app = express();
require("./config/database");

//middlewares

app.use("/admin", auth);
app.get("/admin/getAllData", (req, res) => {
  res.send("Data fetched successfully");
});

app.delete("/admin/deleteAll", (req, res) => {
  res.send("data deleted successfully");
});

//user route

app.get("/user/getAllData", userAuth, (req, res) => {
  res.send("user data fetched successfully");
});
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
