const post = require('../models/post');
const user = require('../models/user');
const comment = require('../models/comment');

let createPost = async (req, res) => {

    let text = req.body.text;
    let title = req.body.title;

    let newPost = new post({
        text: text,
        title: title,
        user: req.user._id
    })

    try {
        newPost = await newPost.save();

        let updatedUser = await user.updateOne(
            { id: req.user._id },
            { $push: { posts: newPost._id } }
        );

    }
    catch {
        res.json({
            err: "Server/DB error"
        })
        return;
    } +

        res.json({
            success: "post created"
        })

}

let getPost = async (req, res) => {

    let posts = await post.find();

    console.log(posts);

    res.json({
        success: posts
    })

}

let addComment = async (req, res) => {

    let id = req.params.id;
    let currComment = req.body.comment;

    let currPost;

    try {

        currPost = await post.findOne({ _id: id })

    } catch {

        res.json({
            err: "Post not avialable"
        })
        return;

    }

    if (!currPost) {
        res.json({
            err: "Post not avialable"
        })
        return;
    }

    console.log({ currComment, user: req.user });

    let newComment = new comment({
        text: currComment,
        user: req.user._id
    })

    newComment = await newComment.save();
    // console.log(newComment);

    await post.updateOne(
        { _id: currPost._id },
        { $push: { comments: newComment._id } }
    )

    res.json({
        success: "comment added"
    })

}

module.exports = { createPost, getPost, addComment };