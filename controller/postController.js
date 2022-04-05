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

    let page = req.query.page || 0;
    let limit = 10;


    let search = req.query.search;
    let sort = req.query.sort;
    let user = req.query.user;

    console.log({ search, sort });

    let searchQuery = {
        $or: [
            {
                text: { $regex: `${search}`, $options: 'i' }
            },
            {
                title: { $regex: `${search}`, $options: 'i' }
            }
        ]
    }

    if (user) {
        searchQuery.user = user;
    }


    let sortQuery;

    if (sort == 'Top') {
        sortQuery = { 'votes': -1 }
    } else {
        sortQuery = { 'date': -1 }
    }

    //count no of posts then pages
    let count = await post.find(searchQuery).count();
    count = Number.parseInt(count / limit);

    let posts = await post
        .find(searchQuery)
        .limit(limit)
        .skip(page * limit)
        .sort(sortQuery)
        .populate('tag user');

    res.json({
        success: {
            posts, count
        }
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
        retPost = await post.findById(id)
            .populate('tag user');
    } catch {
        res.json({
            err: "Invalid ID",
        })
        return;
    }

    res.json({
        success: retPost
    })
}

let removePost = async (req, res) => {

    let id = req.params.id;

    let retPost;

    try {

        retPost = await post.findOne({ _id: id });

        if (retPost.user != req.user.id) {
            res.json({
                err: "Invalid user",
                // uid: retPost.user,
                // fuid: req.user.id,
                // fin: retPost.user == req.user.id
            })
            return;
        }


        retPost = await post.deleteOne({ _id: id });
    } catch {
        res.json({
            err: "Invalid ID",
            id: id
        })
        return;
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


let updateVotes = async (req, res) => {

    // console.log("body", req.body);

    let dec = req.body.dec;
    let id = req.body.id;
    let opr;

    // console.log({ dec });
    if (dec) {
        opr = post.findOneAndUpdate({ _id: id }, { $inc: { votes: -1 } });
    } else {
        opr = post.findOneAndUpdate({ _id: id }, { $inc: { votes: 1 } });
    }

    try {
        opr = await opr;
    }
    catch (e) {
        res.json({
            err: e
        });
        return;
    }


    opr = await post.findOne({ _id: id });

    res.json({
        success: opr,
    })

}

let generateFeed = async (req, res) => {
    console.log(req.params, req.query);

    let search = req.query.search;
    let sort = req.query.sort;
    let page = req.query.page || 0;
    let limit = 10;

    console.log({ search });

    let searchQuery = {
        user: { $in: req.user.follows },

        $or: [
            {
                text: { $regex: search },
            },
            {
                title: { $regex: search }
            }
        ]
    };

    let sortQuery;

    if (sort == 'Top') {
        sortQuery = { 'votes': -1 }
    } else {
        sortQuery = { 'date': -1 }
    }

    let count = await post.find(searchQuery).count();
    count = Number.parseInt(count / limit);

    let posts = await post
        .find(searchQuery)
        .populate('user tag')
        .sort(sortQuery)
        .skip(page * limit)
        .limit(limit);

    res.json({
        success: {
            posts, count
        }
    })
}

let getPostByTag = async (req, res) => {

    // console.log(req.params, req.query);

    let id = req.query.id;
    let sort = req.query.sort;
    let page = req.query.page || 0;
    let limit = 10;

    console.log({ id }, "getPostById");

    let searchQuery = {
        tag: id
    };

    let sortQuery;

    if (sort == 'Top') {
        sortQuery = { 'votes': -1 }
    } else {
        sortQuery = { 'date': -1 }
    }

    let count = await post.find(searchQuery).count();
    count = Number.parseInt(count / limit);

    let posts = await post
        .find(searchQuery)
        .populate('user tag')
        .sort(sortQuery)
        .skip(page * limit)
        .limit(limit);

    let tagName = await tag
        .findOne({ _id: id })
        .populate('name');

    tagName = tagName.name;

    res.json({
        success: {
            posts, count, tagName
        }
    })

}

module.exports = { createPost, getPost, addComment, removePost, getPostById, getPostByUserId, updateVotes, generateFeed, getPostByTag };