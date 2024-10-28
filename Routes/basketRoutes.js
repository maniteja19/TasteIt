// routes/basketRoutes.jsz
const express = require('express');
const router = express.Router();
const basketController = require('../controllers/basketController');

router.post('/add', basketController.addToBasket);
router.put('/update', basketController.updateBasketItem);
router.delete('/remove', basketController.removeFromBasket);
router.get('/:userId', basketController.getBasket);

module.exports = router;
