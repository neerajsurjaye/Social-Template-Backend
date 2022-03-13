const post = require('../models/post');
const user = require('../models/user');
const comment = require('../models/comment');
const tag = require('../models/tag');

let createPost = async (req, res) => {

    let text = req.body.text;
    let title = req.body.title;
    let inpTag = req.body.tag;


    let tagArr = inpTag.split('+');
    let avilableTags = await tag.find({ name: { $in: tagArr } });
    let newTags = [];

    for (let i = 0; i < tagArr.length; i++) {
        let currTag = tagArr[i];
        let sem = 0;

        for (let x in avilableTags) {
            let currAvi = avilableTags[x];

            if (currAvi.name == currTag) {
                sem = 1;
            }

        }

        if (sem != 1) {
            newTags.push(currTag);
        }

    }

    // console.log("new tags", newTags);

    for (let x in newTags) {
        let tagName = newTags[x];

        let newTag = new tag({
            name: tagName
        })

        newTag = await newTag.save();
        avilableTags.push(newTag);
    }

    avilableTags = avilableTags.map((x) => {
        return x._id;
    })

    let newPost = new post({
        text: text,
        title: title,
        user: req.user._id,
        tag: avilableTags
    })

    try {
        newPost = await newPost.save();
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

    let posts = await post.find().populate('tag');

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

let getPostById = async (req, res) => {

    let id = req.params.id;

    let retPost;

    try {
        retPost = await post.findById(id);
    } catch {
        res.json({
            err: "Invalid ID",
        })
    }

    res.json({
        success: retPost
    })
}

let removePost = async (req, res) => {

    let id = req.params.id;

    let retPost;

    try {
        retPost = await post.deleteOne({ _id: id });
    } catch {
        res.json({
            err: "Invalid ID",
        })
    }

    res.json({
        success: retPost
    })

}

const getPostByUserId = async (req, res) => {

    let id = req.params.id;

    let posts = await post.find({ user: id });

    res.send({
        success: posts
    })
}

module.exports = { createPost, getPost, addComment, removePost, getPostById, getPostByUserId };