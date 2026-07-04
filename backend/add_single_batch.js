const connectDB = require('./config/db');
const mongoose = require('mongoose');
const Medicine = require('./models/Medicine');
const Batch = require('./models/Batch');

const run = async () => {
  try {
    await connectDB();

    // find a medicine to attach the batch to
    let medicine = await Medicine.findOne({ name: /Ibuprofen/i });
    if (!medicine) {
      medicine = await Medicine.findOne();
    }

    if (!medicine) {
      console.error('No medicines found in DB. Run seed first.');
      process.exit(1);
    }

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 20);

    const batch = new Batch({
      medicine: medicine._id,
      batchNo: 'AUTO-' + Date.now().toString().slice(-5),
      expiryDate: futureDate,
      quantity: 100,
      costPrice: 0.2,
      sellingPrice: 0.4
    });

    await batch.save();
    console.log('✅ Inserted batch for', medicine.name, 'batchNo:', batch.batchNo);
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed', err);
    process.exit(1);
  }
};

run();
