const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

const { 
    restaurantsController,
    deleterestaurantController, 
    addDishes, 
    getDishes,
    deleteDishes,
    RestaurantDetails,
    updateSellerController
} = require('../controllers/sellerController');

router.get('/sellerDetails',verifyToken,RestaurantDetails);
router.post('/updateSellerDetails',updateSellerController);
router.get('/restaurants',restaurantsController);
router.delete('/restaurants/:id',deleterestaurantController);

router.post('/sellers/:id/dishes',addDishes);
router.get('/sellers/:id/dishes',getDishes);
router.delete('/sellers/:sellerId/dishes/:dishId',deleteDishes);

module.exports = router; 