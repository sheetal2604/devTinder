const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://sheetal_db_user:rsvIuMF3jxJnd95U@nodejs.x6wd9jp.mongodb.net/devTinder",
  );
};
module.exports = connectDB;

