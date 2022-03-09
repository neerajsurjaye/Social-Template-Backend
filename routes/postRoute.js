const express = require('express');
const router = express.Router();


//create post
router.post('/', (req, res) => {

})

//get post by id
router.get('/:id', (req, res) => {
    res.send({
        ret: req.params.id,
    })
})

//?page ?tag
router.get('/', (req, res) => {
    let page = req.query.page;
    let user = req.query.user;
    let tag = req.query.tag;

    res.json({
        page, user, tag
    })

})

//update post
router.put('/:id', (req, res) => {

})

//delete post
router.delete('/:id', (req, res) => {

})



module.exports = router;