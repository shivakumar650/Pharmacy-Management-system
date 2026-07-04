const Batch = require("../models/Batch");
const Medicine = require("../models/Medicine");

// ADD BATCH
exports.addBatch = async (req, res, next) => {
  try {
    const {
      medicineId,
      batchNo,
      expiryDate,
      quantity,
      costPrice,
      sellingPrice
    } = req.body;

    // Validation
    if (!medicineId || !batchNo || !expiryDate || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check medicine exists
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    // Prevent expired batch entry
    if (new Date(expiryDate) <= new Date()) {
      return res.status(400).json({ message: "Expiry date must be in future" });
    }

    const batch = new Batch({
      medicine: medicineId,
      batchNo,
      expiryDate,
      quantity,
      costPrice,
      sellingPrice
    });

    await batch.save();

    res.status(201).json(batch);
  } catch (error) {
    next(error);
  }
};

// GET ALL BATCHES
exports.getBatches = async (req, res, next) => {
  try {
    const batches = await Batch.find().populate("medicine", "name");
    res.json(batches);
  } catch (error) {
    next(error);
  }
};

// DELETE BATCH
exports.deleteBatch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findById(id);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });

    await Batch.deleteOne({ _id: id });
    res.json({ message: 'Batch deleted' });
  } catch (error) {
    next(error);
  }
};
