const express = require('express');
const router = express.Router();

const postController = require('../controller/postController');
const authController = require('../controller/authController');
const commentRoute = require('../routes/commentRoute');

//create post
router.post('/', authController.isAuth, postController.createPost);

//generate feed
router.get('/feed', authController.isAuth, postController.generateFeed);

//reccomendation
router.get('/recc', authController.isAuth, postController.getReccomendedPost);

// get post by tag
router.get('/tag', postController.getPostByTag);
//get post by id
router.get('/:id', postController.getPostById);

//?page ?tag
router.get('/', postController.getPost);




//handles comments
router.use('/:id/comments', commentRoute);

//update votes
router.use('/:id/votes', authController.isAuth, postController.updateVotes);

//update post
router.put('/:id', (req, res) => {

})

//delete post
router.delete('/:id', authController.isAuth, postController.removePost)



module.exports = router;