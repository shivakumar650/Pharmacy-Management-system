const connectDB = require('./config/db');
const mongoose = require('mongoose');
const Medicine = require('./models/Medicine');
const Batch = require('./models/Batch');

const run = async () => {
  try {
    await connectDB();

    // Clear existing sample data (only collections if you want fresh seed)
    await Medicine.deleteMany({});
    await Batch.deleteMany({});

    const meds = [
      { name: 'Paracetamol 500mg', category: 'Analgesic' },
      { name: 'Ibuprofen 200mg', category: 'NSAID' },
      { name: 'Amoxicillin 500mg', category: 'Antibiotic' },
      { name: 'Cetirizine 10mg', category: 'Antihistamine' },
      { name: 'Omeprazole 20mg', category: 'Antacid' },
      { name: 'Metformin 500mg', category: 'Antidiabetic' },
      { name: 'Atorvastatin 10mg', category: 'Statin' },
      { name: 'Aspirin 75mg', category: 'Antiplatelet' },
      { name: 'Salbutamol Inhaler', category: 'Bronchodilator' },
      { name: 'Loratadine 10mg', category: 'Antihistamine' }
    ];

    const insertedMeds = await Medicine.insertMany(meds);

    // Helper to create future dates
    const daysFromNow = (n) => {
      const d = new Date();
      d.setDate(d.getDate() + n);
      return d;
    };

    // Create batches: some expiring soon, some later
    const batches = [
      { medicine: insertedMeds[0]._id, batchNo: 'P-001', expiryDate: daysFromNow(5), quantity: 120, costPrice: 0.05, sellingPrice: 0.1 },
      { medicine: insertedMeds[0]._id, batchNo: 'P-002', expiryDate: daysFromNow(180), quantity: 500, costPrice: 0.04, sellingPrice: 0.09 },
      { medicine: insertedMeds[1]._id, batchNo: 'I-001', expiryDate: daysFromNow(15), quantity: 80, costPrice: 0.08, sellingPrice: 0.16 },
      { medicine: insertedMeds[2]._id, batchNo: 'A-101', expiryDate: daysFromNow(45), quantity: 200, costPrice: 0.25, sellingPrice: 0.5 },
      { medicine: insertedMeds[3]._id, batchNo: 'C-010', expiryDate: daysFromNow(3), quantity: 30, costPrice: 0.12, sellingPrice: 0.25 },
      { medicine: insertedMeds[4]._id, batchNo: 'O-050', expiryDate: daysFromNow(365), quantity: 150, costPrice: 0.5, sellingPrice: 1.0 },
      { medicine: insertedMeds[5]._id, batchNo: 'M-500', expiryDate: daysFromNow(60), quantity: 220, costPrice: 0.2, sellingPrice: 0.4 },
      { medicine: insertedMeds[6]._id, batchNo: 'AT-010', expiryDate: daysFromNow(10), quantity: 40, costPrice: 0.3, sellingPrice: 0.6 },
      { medicine: insertedMeds[7]._id, batchNo: 'AS-075', expiryDate: daysFromNow(2), quantity: 25, costPrice: 0.02, sellingPrice: 0.05 },
      { medicine: insertedMeds[8]._id, batchNo: 'S-001', expiryDate: daysFromNow(90), quantity: 60, costPrice: 1.5, sellingPrice: 3.0 },
      { medicine: insertedMeds[9]._id, batchNo: 'L-010', expiryDate: daysFromNow(20), quantity: 75, costPrice: 0.18, sellingPrice: 0.35 }
    ];

    await Batch.insertMany(batches);

    console.log('✅ Seed data inserted successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed', err);
    process.exit(1);
  }
};

run();
