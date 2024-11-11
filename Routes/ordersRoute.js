const express = require('express');
const {bookOrders,getOrders, getOrderedDishes} = require('../controllers/ordersController');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.post('/orders',bookOrders);
router.get('/orders',verifyToken, getOrders)
router.get('/OrderedDishes',verifyToken, getOrderedDishes);

module.exports = router; 