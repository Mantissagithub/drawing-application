const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.post('/refreshaccesstoken', AuthController.refreshAccessToken);
router.post('/logout', AuthController.logout);

module.exports = router;