const express = require("express");
const router = express.Router();

const medicineController = require("../controllers/medicineController");

router.post("/", medicineController.addMedicine);
router.get("/", medicineController.getMedicines);

module.exports = router;
