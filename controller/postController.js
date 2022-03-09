const post = require('../models/post');
const user = require('../models/user');

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
    }

    res.json({
        success: "post created"
    })

}

let getPost = async (req, res) => {

    let posts = await post.find().populate('user');

    console.log(posts);

    res.json({
        success: posts
    })

}

module.exports = { createPost, getPost };