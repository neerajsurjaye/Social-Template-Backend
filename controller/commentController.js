let comment = require('../models/comment');

let getAllComments = async (req, res) => {

    let postId = req.params.id;

    let resComments = await comment.find({
        post: postId
    })

    res.send({
        success: resComments
    })
}

let createComment = async (req, res) => {

    let newComment = new comment({
        text: req.body.text,
        user: req.user._id,
        post: req.params.id
    })

    newComment = await newComment.save();

    res.json({
        success: newComment,
    })
}

let deleteComment = async (req, res) => {

    let cid = req.params.cid;
    console.log(req.params);
    let deleteResponse = await comment.deleteOne({
        _id: cid
    })

    res.json({
        success: deleteResponse
    })

}

module.exports = { createComment, getAllComments, deleteComment };