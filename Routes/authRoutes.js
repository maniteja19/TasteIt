const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/register',authController.RegisterController);
router.post('/login',authController.LoginController);
router.post('/register-seller', authController.registerSellerController);
module.exports = router;