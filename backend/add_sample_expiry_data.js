const mongoose = require('mongoose');
require('dotenv').config();

const Medicine = require('./models/Medicine');
const Batch = require('./models/Batch');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pharmacy');

async function addSampleData() {
  try {
    // Clear existing data
    await Batch.deleteMany({});
    await Medicine.deleteMany({});

    // Create medicines
    const medicines = await Medicine.insertMany([
      { name: 'Aspirin 75mg' },
      { name: 'Paracetamol 500mg' },
      { name: 'Ibuprofen 200mg' },
      { name: 'Amoxicillin 500mg' },
      { name: 'Cetirizine 10mg' },
      { name: 'Omeprazole 20mg' },
      { name: 'Metformin 500mg' },
      { name: 'Atorvastatin 10mg' }
    ]);

    const today = new Date();
    
    // Create batches with various expiry dates
    const batches = [
      // EXPIRED MEDICINES (to show actual losses)
      {
        medicine: medicines[0]._id,
        batchNo: 'EXP-001',
        expiryDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        quantity: 100,
        costPrice: 5.50,
        sellingPrice: 8.00
      },
      {
        medicine: medicines[1]._id,
        batchNo: 'EXP-002',
        expiryDate: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        quantity: 200,
        costPrice: 3.25,
        sellingPrice: 5.00
      },
      {
        medicine: medicines[2]._id,
        batchNo: 'EXP-003',
        expiryDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        quantity: 150,
        costPrice: 4.75,
        sellingPrice: 7.50
      },

      // CRITICAL - EXPIRING SOON (≤7 days)
      {
        medicine: medicines[0]._id,
        batchNo: 'CRIT-001',
        expiryDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days
        quantity: 75,
        costPrice: 5.50,
        sellingPrice: 8.00
      },
      {
        medicine: medicines[3]._id,
        batchNo: 'CRIT-002',
        expiryDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days
        quantity: 120,
        costPrice: 12.00,
        sellingPrice: 18.00
      },
      {
        medicine: medicines[4]._id,
        batchNo: 'CRIT-003',
        expiryDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
        quantity: 80,
        costPrice: 2.25,
        sellingPrice: 4.00
      },

      // WARNING - EXPIRING WITHIN 30 DAYS
      {
        medicine: medicines[1]._id,
        batchNo: 'WARN-001',
        expiryDate: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days
        quantity: 300,
        costPrice: 3.25,
        sellingPrice: 5.00
      },
      {
        medicine: medicines[5]._id,
        batchNo: 'WARN-002',
        expiryDate: new Date(today.getTime() + 25 * 24 * 60 * 60 * 1000), // 25 days
        quantity: 90,
        costPrice: 8.50,
        sellingPrice: 12.00
      },
      {
        medicine: medicines[6]._id,
        batchNo: 'WARN-003',
        expiryDate: new Date(today.getTime() + 28 * 24 * 60 * 60 * 1000), // 28 days
        quantity: 180,
        costPrice: 6.75,
        sellingPrice: 10.00
      },

      // NORMAL - GOOD EXPIRY DATES
      {
        medicine: medicines[2]._id,
        batchNo: 'NORM-001',
        expiryDate: new Date(today.getTime() + 180 * 24 * 60 * 60 * 1000), // 6 months
        quantity: 500,
        costPrice: 4.75,
        sellingPrice: 7.50
      },
      {
        medicine: medicines[7]._id,
        batchNo: 'NORM-002',
        expiryDate: new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 year
        quantity: 250,
        costPrice: 15.00,
        sellingPrice: 22.00
      },
      {
        medicine: medicines[3]._id,
        batchNo: 'NORM-003',
        expiryDate: new Date(today.getTime() + 270 * 24 * 60 * 60 * 1000), // 9 months
        quantity: 400,
        costPrice: 12.00,
        sellingPrice: 18.00
      }
    ];

    await Batch.insertMany(batches);

    console.log('✅ Sample data added successfully!');
    console.log('\n📊 Summary:');
    console.log('- 3 expired batches (actual losses)');
    console.log('- 3 critical batches (≤7 days)');
    console.log('- 3 warning batches (≤30 days)');
    console.log('- 3 normal batches (>30 days)');
    
    // Calculate losses
    const expiredLoss = batches.slice(0, 3).reduce((sum, b) => sum + (b.quantity * b.costPrice), 0);
    const potentialLoss = batches.slice(3, 9).reduce((sum, b) => sum + (b.quantity * b.costPrice), 0);
    
    console.log(`\n💰 Financial Impact:`);
    console.log(`- Actual Loss (expired): $${expiredLoss.toFixed(2)}`);
    console.log(`- Potential Loss (expiring soon): $${potentialLoss.toFixed(2)}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addSampleData();