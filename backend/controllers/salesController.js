const Sale = require('../models/Sale');
const Batch = require('../models/Batch');
const Medicine = require('../models/Medicine');

// Generate invoice number
const generateInvoiceNumber = async () => {
  const count = await Sale.countDocuments();
  return `INV-${Date.now()}-${count + 1}`;
};

// Record a sale
const recordSale = async (req, res) => {
  try {
    const { batchId, quantity, customerId } = req.body;

    if (!batchId || !quantity) {
      return res.status(400).json({ message: 'Batch ID and quantity are required' });
    }

    const batch = await Batch.findById(batchId).populate('medicine');
    if (!batch) return res.status(404).json({ message: 'Batch not found' });

    if (batch.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const sellingPrice = batch.sellingPrice || 10;
    const invoiceNumber = await generateInvoiceNumber();

    // Create sale record
    const sale = await Sale.create({
      invoiceNumber,
      customer: customerId || null,
      medicine: batch.medicine._id,
      batch: batchId,
      quantity,
      sellingPrice: sellingPrice,
      totalAmount: sellingPrice * quantity
    });

    // Update batch quantity
    batch.quantity -= quantity;
    await batch.save();

    const populatedSale = await Sale.findById(sale._id)
      .populate('medicine')
      .populate('batch')
      .populate('customer');

    res.status(201).json(populatedSale);
  } catch (error) {
    console.error('Error recording sale:', error);
    res.status(500).json({ message: error.message || 'Failed to record sale' });
  }
};

// Get sales history
const getSalesHistory = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('medicine', 'name')
      .populate('batch', 'batchNo')
      .populate('customer', 'name phone')
      .sort({ soldAt: -1 })
      .lean();

    console.log(`Fetched ${sales.length} sales`);
    res.json(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ message: 'Failed to fetch sales history' });
  }
};

// Get single invoice
const getInvoice = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('medicine')
      .populate('batch')
      .populate('customer');
    
    if (!sale) return res.status(404).json({ message: 'Invoice not found' });
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch invoice' });
  }
};

module.exports = { recordSale, getSalesHistory, getInvoice };
