const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../controller/authController');


const commentController = require('../controller/commentController');
// crud operations on comment
router.post('/', auth.isAuth, commentController.createComment);

//get comments paginated
router.get('/', commentController.getAllComments);

router.put('/:id', (req, res) => {

})

router.delete('/:cid', commentController.deleteComment)

module.exports = router;