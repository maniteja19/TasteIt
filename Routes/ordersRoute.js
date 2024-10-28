const express = require('express');
const {bookOrders,getOrders} = require('../controllers/ordersController');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.post('/orders',bookOrders);
router.get('/orders',verifyToken, getOrders)

module.exports = router; 