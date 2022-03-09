const express = require('express');
const router = express.Router();

const authController = require('../controller/authController');

// crud operations on comment
router.post('/login', authController.login);


module.exports = router;