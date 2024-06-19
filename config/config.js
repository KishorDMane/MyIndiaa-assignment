
const mongoose = require("mongoose");
require("dotenv").config();
const mongo_url = process.env.mongoUrl;

// Connect to MongoDB
mongoose.connect(mongo_url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

  console
// Export the Mongoose instance for use in other modules
module.exports = mongoose;
