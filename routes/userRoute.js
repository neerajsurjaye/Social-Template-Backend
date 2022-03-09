const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');

// /api/user/

//creates a user
router.post('/', userController.createUser);

router.get('/:id', userController.getUserById);

router.get('/', userController.getUserByName);

//update user details
router.put('/', (req, res) => {

})

//removes a user
router.delete('/', (req, res) => {

})

module.exports = router;