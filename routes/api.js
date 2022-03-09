const express = require('express');
const router = express.Router();

//importing router
const postController = require('./postRoute');
const commentController = require('./commentRoute');
const tagController = require('./tagRoute');
const userController = require('./userRoute');

router.get('/', (req, res) => {
    res.json({
        success: "api home",
    })
})

router.use('/post/', postController);
router.use('/user/', userController);
router.use('/comment/', commentController);
router.use('/tag/', tagController);


module.exports = router;
