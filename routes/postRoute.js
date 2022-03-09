const express = require('express');
const router = express.Router();

const postController = require('../controller/postController');
const authController = require('../controller/authController')

//create post
router.post('/', authController.isAuth, postController.createPost);

//get post by id
router.get('/:id', (req, res) => {
    res.send({
        ret: req.params.id,
    })
})

//?page ?tag
router.get('/', postController.getPost)

//update post
router.put('/:id', (req, res) => {

})

//delete post
router.delete('/:id', (req, res) => {

})



module.exports = router;