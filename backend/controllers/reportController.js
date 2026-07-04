const Batch = require("../models/Batch");

// EXPIRY REPORT
exports.getExpiryReport = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;

    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const expiringBatches = await Batch.aggregate([
      {
        $match: {
          expiryDate: { $gte: today, $lte: futureDate }
        }
      },
      {
        $lookup: {
          from: "medicines",
          localField: "medicine",
          foreignField: "_id",
          as: "medicineInfo"
        }
      },
      { $unwind: "$medicineInfo" },
      {
        $project: {
          _id: 0,
          medicineName: "$medicineInfo.name",
          batchNo: 1,
          expiryDate: 1,
          quantity: 1,
          costPrice: 1,
          daysLeft: {
            $ceil: {
              $divide: [
                { $subtract: ["$expiryDate", today] },
                1000 * 60 * 60 * 24
              ]
            }
          },
          potentialLoss: { $multiply: ["$quantity", "$costPrice"] }
        }
      },
      { $sort: { expiryDate: 1 } }
    ]);

    res.json(expiringBatches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// INVENTORY REPORT
exports.getInventoryReport = async (req, res) => {
  try {
    const today = new Date();

    const report = await Batch.aggregate([
      { $match: { expiryDate: { $gt: today } } },
      {
        $group: {
          _id: "$medicine",
          totalQuantity: { $sum: "$quantity" },
          totalStockValue: {
            $sum: { $multiply: ["$quantity", "$costPrice"] }
          }
        }
      },
      {
        $lookup: {
          from: "medicines",
          localField: "_id",
          foreignField: "_id",
          as: "medicine"
        }
      },
      { $unwind: "$medicine" },
      {
        $project: {
          _id: 0,
          medicineId: "$medicine._id",
          medicineName: "$medicine.name",
          totalQuantity: 1,
          totalStockValue: 1
        }
      }
    ]);

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOSS REPORT - Expired medicines financial impact
exports.getLossReport = async (req, res) => {
  try {
    const today = new Date();

    const expiredBatches = await Batch.aggregate([
      {
        $match: {
          expiryDate: { $lt: today }
        }
      },
      {
        $lookup: {
          from: "medicines",
          localField: "medicine",
          foreignField: "_id",
          as: "medicineInfo"
        }
      },
      { $unwind: "$medicineInfo" },
      {
        $project: {
          _id: 0,
          medicineName: "$medicineInfo.name",
          batchNo: 1,
          expiryDate: 1,
          quantity: 1,
          costPrice: 1,
          loss: { $multiply: ["$quantity", "$costPrice"] },
          daysExpired: {
            $ceil: {
              $divide: [
                { $subtract: [today, "$expiryDate"] },
                1000 * 60 * 60 * 24
              ]
            }
          }
        }
      },
      { $sort: { expiryDate: -1 } }
    ]);

    const totalLoss = expiredBatches.reduce((sum, batch) => sum + batch.loss, 0);
    const totalExpiredQuantity = expiredBatches.reduce((sum, batch) => sum + batch.quantity, 0);

    res.json({
      expiredBatches,
      summary: {
        totalLoss,
        totalExpiredQuantity,
        totalExpiredBatches: expiredBatches.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
