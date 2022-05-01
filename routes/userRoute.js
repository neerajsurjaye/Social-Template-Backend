const express = require('express');
const router = express.Router({ mergeParams: true });

const userController = require('../controller/userController');
const postController = require('../controller/postController');
const authController = require('../controller/authController');

// /api/user/

//creates a user
router.post('/', userController.createUser);

router.get('/current', authController.isAuth, userController.getCurrentUser);

router.get('/:id', userController.getUserById);

router.get('/', userController.getUserByName);

router.put('/follow/:id', authController.isAuth, userController.followUser);

//:id/post/?page
router.get('/:id/post/', postController.getPostByUserId);

//update user details
router.put('/', (req, res) => {

})

router.get('/follow/:id', authController.isAuth, userController.follows);


//removes a user
router.delete('/', (req, res) => {

})

module.exports = router;