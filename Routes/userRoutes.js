const express = require('express');
const router = express.Router();
const {userDetails, updateProfileController, getFavourites }= require('../controllers/userController')
const verifyToken = require('../middleware/verifyToken');

router.get('/userDetails',verifyToken,userDetails);
router.post('/updateProfile',updateProfileController);
router.get('/favourites/:id',getFavourites);
module.exports = router;
