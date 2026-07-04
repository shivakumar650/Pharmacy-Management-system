const mongoose = require('mongoose');
require('dotenv').config();

const Medicine = require('./models/Medicine');
const Batch = require('./models/Batch');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pharmacy');

async function fixSampleData() {
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
      { name: 'Omeprazole 20mg' }
    ]);

    const today = new Date();
    
    // Create batches with correct dates
    const batches = [
      // EXPIRED MEDICINES (past dates)
      {
        medicine: medicines[0]._id,
        batchNo: 'EXP-001',
        expiryDate: new Date('2024-01-15'), // Already expired
        quantity: 100,
        costPrice: 5.50,
        sellingPrice: 8.00
      },
      {
        medicine: medicines[1]._id,
        batchNo: 'EXP-002',
        expiryDate: new Date('2024-01-20'), // Already expired
        quantity: 200,
        costPrice: 3.25,
        sellingPrice: 5.00
      },

      // CRITICAL - EXPIRING VERY SOON
      {
        medicine: medicines[0]._id,
        batchNo: 'CRIT-001',
        expiryDate: new Date('2026-02-08'), // 2 days from now
        quantity: 75,
        costPrice: 5.50,
        sellingPrice: 8.00
      },
      {
        medicine: medicines[3]._id,
        batchNo: 'CRIT-002',
        expiryDate: new Date('2026-02-10'), // 5 days from now
        quantity: 120,
        costPrice: 12.00,
        sellingPrice: 18.00
      },

      // WARNING - EXPIRING WITHIN 30 DAYS
      {
        medicine: medicines[1]._id,
        batchNo: 'WARN-001',
        expiryDate: new Date('2026-02-20'), // 15 days from now
        quantity: 300,
        costPrice: 3.25,
        sellingPrice: 5.00
      },
      {
        medicine: medicines[4]._id,
        batchNo: 'WARN-002',
        expiryDate: new Date('2026-03-05'), // 28 days from now
        quantity: 90,
        costPrice: 8.50,
        sellingPrice: 12.00
      },

      // NORMAL - GOOD EXPIRY DATES
      {
        medicine: medicines[2]._id,
        batchNo: 'NORM-001',
        expiryDate: new Date('2026-08-05'), // 6 months from now
        quantity: 500,
        costPrice: 4.75,
        sellingPrice: 7.50
      },
      {
        medicine: medicines[5]._id,
        batchNo: 'NORM-002',
        expiryDate: new Date('2027-02-05'), // 1 year from now
        quantity: 250,
        costPrice: 15.00,
        sellingPrice: 22.00
      }
    ];

    await Batch.insertMany(batches);

    console.log('✅ Fixed sample data added successfully!');
    console.log('\n📊 Summary:');
    console.log('- 2 expired batches (actual losses)');
    console.log('- 2 critical batches (≤7 days)');
    console.log('- 2 warning batches (≤30 days)');
    console.log('- 2 normal batches (>30 days)');
    
    // Calculate losses
    const expiredLoss = 100 * 5.50 + 200 * 3.25; // $1200
    const potentialLoss = 75 * 5.50 + 120 * 12.00 + 300 * 3.25 + 90 * 8.50; // Critical + Warning
    
    console.log(`\n💰 Financial Impact:`);
    console.log(`- Actual Loss (expired): $${expiredLoss.toFixed(2)}`);
    console.log(`- Potential Loss (expiring soon): $${potentialLoss.toFixed(2)}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixSampleData();