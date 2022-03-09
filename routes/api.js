const express = require('express');
const router = express.Router();

//importing router
const postRoute = require('./postRoute');
const commentRoute = require('./commentRoute');
const tagRoute = require('./tagRoute');
const userRoute = require('./userRoute');
const authRoute = require('./authRoute')

router.get('/', (req, res) => {
    res.json({
        success: "api home",
    })
})

router.use('/auth/', authRoute);
router.use('/post/', postRoute);
router.use('/user/', userRoute);
router.use('/comment/', commentRoute);
router.use('/tag/', tagRoute);


module.exports = router;

