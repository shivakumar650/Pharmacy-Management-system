const express = require('express');
const { recordSale, getSalesHistory, getInvoice } = require('../controllers/salesController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/sales', authMiddleware, recordSale);
router.get('/sales', authMiddleware, getSalesHistory);
router.get('/sales/:id', authMiddleware, getInvoice);

module.exports = router;
