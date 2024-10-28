const express = require('express');
const {updateSellerStatus,getPendingSellers} = require('../controllers/adminController');
//const {protect, admin} = require('../middleware/adminMiddleware');

const router = express.Router();
router.get('/sellers', getPendingSellers);
router.put('/sellers/:sellerId/status',updateSellerStatus);

module.exports = router;