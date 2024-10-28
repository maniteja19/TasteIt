const express = require('express');
const router = express.Router();
const {userDetails, updateProfileController }= require('../controllers/userController')
const verifyToken = require('../middleware/verifyToken');

router.get('/userDetails',verifyToken,userDetails);
router.post('/updateProfile',updateProfileController);

module.exports = router;
