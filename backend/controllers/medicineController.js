const Medicine = require("../models/Medicine");

// ADD MEDICINE
exports.addMedicine = async (req, res, next) => {
  try {
    const { name, category } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Medicine name is required" });
    }

    const medicine = new Medicine({ name, category });
    await medicine.save();

    res.status(201).json(medicine);
  } catch (error) {
    next(error);
  }
};

// GET ALL MEDICINES
exports.getMedicines = async (req, res, next) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 });
    res.json(medicines);
  } catch (error) {
    next(error);
  }
};
