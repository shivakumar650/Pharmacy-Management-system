console.log("✅ batchRoutes loaded");
const express = require("express");
const router = express.Router();

const batchController = require("../controllers/batchController");

router.post("/", batchController.addBatch);
router.get("/", batchController.getBatches);
router.delete('/:id', batchController.deleteBatch);

module.exports = router;
