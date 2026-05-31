const express = require("express");
const app = express();

app.use("/home", (req, res) => {
  res.send("Hello World");
});

app.use("/test", (req, res) => {
  res.send("This is a test route");
});

app.use("/", (req, res) => {
  res.send("This is a dashboard route");
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
