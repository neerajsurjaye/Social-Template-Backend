const express = require('express');
const router = express.Router({ mergeParams: true });

const userController = require('../controller/userController');
const postController = require('../controller/postController');

// /api/user/

//creates a user
router.post('/', userController.createUser);

router.get('/:id', userController.getUserById);

router.get('/', userController.getUserByName);

//:id/post/?page
router.get('/:id/post/', postController.getPostByUserId);

//update user details
router.put('/', (req, res) => {

})

//removes a user
router.delete('/', (req, res) => {

})

module.exports = router;