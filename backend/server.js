require("dotenv").config();

const express = require("express");
const cron = require("node-cron");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const batchRoutes = require("./routes/batchRoutes");
const salesRoutes = require("./routes/salesRoutes");
const customerRoutes = require("./routes/customerRoutes");

const auth = require("./middleware/authMiddleware");
const { sendExpiryAlert } = require("./utils/emailService");
const Batch = require("./models/Batch");

const app = express();

// =====================
// MIDDLEWARE
// =====================
const cors = require("cors");
app.use(cors());
app.use(express.json());

// =====================
// DATABASE
// =====================
const Medicine = require("./models/Medicine");

connectDB().then(async () => {
  try {
    const count = await Medicine.countDocuments();
    if (count === 0) {
      console.log("⚠️ Database is empty. Please run `npm run seed` to populate it with sample data!");
    }
  } catch (err) {
    console.error("Failed to check database collection:", err);
  }
});

// =====================
// ROUTES
// =====================
app.use("/api/auth", authRoutes);

// protected routes
app.use("/api/reports", auth, reportRoutes);
app.use("/api/medicines", auth, medicineRoutes);
app.use("/api/batches", auth, batchRoutes);
app.use("/api/customers", auth, customerRoutes);
app.use("/api", auth, salesRoutes);

// =====================
// CRON JOB — DAILY 9 AM
// =====================
cron.schedule("0 9 * * *", async () => {
  try {
    console.log("⏰ Running expiry email check...");

    const today = new Date();
    const criticalDate = new Date();
    criticalDate.setDate(today.getDate() + 7);

    const batches = await Batch.find({
      expiryDate: { $lte: criticalDate, $gte: today }
    }).populate("medicine");

    if (batches.length === 0) {
      console.log("✅ No critical expiries");
      return;
    }

    const formatted = batches.map(b => ({
      medicineName: b.medicine.name,
      batchNo: b.batchNo,
      daysLeft: Math.ceil(
        (b.expiryDate - today) / (1000 * 60 * 60 * 24)
      ),
      quantity: b.quantity
    }));

    await sendExpiryAlert(formatted);
    console.log("📧 Expiry alert email sent");
  } catch (err) {
    console.error("❌ Expiry cron failed:", err.message);
  }
});

// =====================
// GLOBAL ERROR HANDLER
// =====================
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {}
  });
});

// =====================
// SERVER
// =====================
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
