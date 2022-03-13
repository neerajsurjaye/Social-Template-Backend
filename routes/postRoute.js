const express = require('express');
const router = express.Router();

const postController = require('../controller/postController');
const authController = require('../controller/authController');
const commentRoute = require('../routes/commentRoute');

//create post
router.post('/', authController.isAuth, postController.createPost);

//get post by id
router.get('/:id', postController.getPostById);

//?page ?tag
router.get('/', postController.getPost);


//handles comments
router.use('/:id/comment', authController.isAuth, commentRoute);

//update post
router.put('/:id', (req, res) => {

})

//delete post
router.delete('/:id', postController.removePost)



module.exports = router;