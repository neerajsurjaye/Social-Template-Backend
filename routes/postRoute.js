const express = require('express');
const router = express.Router();

const postController = require('../controller/postController');
const authController = require('../controller/authController')

//create post
router.post('/', authController.isAuth, postController.createPost);

//get post by id
router.get('/:id', postController.getPostById);

//?page ?tag
router.get('/', postController.getPost);


router.post('/:id/comment', authController.isAuth, postController.addComment);

//update post
router.put('/:id', (req, res) => {

})

//delete post
router.delete('/:id', postController.removePost)



module.exports = router;