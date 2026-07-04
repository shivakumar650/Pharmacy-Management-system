const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pharmacy";
    await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB connected successfully to ${mongoURI.includes("127.0.0.1") ? "local db" : "remote db"}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed");
    process.exit(1);
  }
};

module.exports = connectDB;
