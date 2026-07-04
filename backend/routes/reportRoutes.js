console.log("✅ reportRoutes loaded");
const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");

// Inventory report
router.get("/inventory", reportController.getInventoryReport);

// Expiry alert report
router.get("/expiry", reportController.getExpiryReport);

// Loss report for expired medicines
router.get("/losses", reportController.getLossReport);

module.exports = router;
