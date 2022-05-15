const post = require('../models/post');
const user = require('../models/user');
const comment = require('../models/comment');
const tag = require('../models/tag');
const { spawn } = require('child_process')
const postCluster = require('../models/postcluster');
const reccomendation = require('../models/userReccomendation');
const votesMap = require('../models/votesMap');
const userFollow = require('../models/userFollow');
const { log } = require('console');

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

    // console.log({ newPost });
    savePostCluster(newPost.id);

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

    // console.log({ search, sort });
    // console.log("clusters", await postCluster.find());

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

    let out = [];
    for (let x in posts) {
        y = posts[x];

        let cluster = await postCluster.findOne({
            postid: y.id
        })

        if (!y) {
            continue;
        }

        y = y.toObject();
        y.cluster = cluster;
        out.push(y);
    }

    let follows = false;



    res.json({
        success: {
            posts: out, count
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

    // console.log({ currComment, user: req.user });

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

    // console.log({ retPost }, retPost.id);

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
    let uid = req.user.id;

    console.log("ran");
    let posts = await post.find({ user: id });
    let follows = await userFollow.findOne({
        userId: id,
        followId: uid
    });

    follows = follows ? true : false;

    res.send({
        success: posts,
        follows
    })
}

let canUpdateVotes = async (id, dec) => {

    let voteStatus = await votesMap.findOne({ userId: id });
    let status = dec ? -1 : 1;

    console.log({ voteStatus });


    if (!voteStatus) {
        let vote = new votesMap({
            userId: id,
            status: status
        })

        await vote.save();

        return status;
    }


    if (voteStatus.status != 1 && !dec) {
        await votesMap.updateOne({ userId: id }, { status: voteStatus.status + 1 });
        return 1;
    }

    if (voteStatus.status != -1 && dec) {
        await votesMap.updateOne({ userId: id }, { status: voteStatus.status - 1 });
        return -1;
    }

    return 0;


}

let updateVotes = async (req, res) => {

    // console.log("body", req.body);

    let dec = req.body.dec;
    let id = req.body.id;
    let opr;

    //deprecated
    // if (dec) {
    //     opr = post.findOneAndUpdate({ _id: id }, { $inc: { votes: -1 } });
    // } else {
    //     opr = post.findOneAndUpdate({ _id: id }, { $inc: { votes: 1 } });
    // }

    // console.log(await canUpdateVotes(id, dec));
    opr = await post.findOneAndUpdate(
        { _id: id },
        {
            $inc: {
                votes: await canUpdateVotes(id, dec),
            }
        }
    );


    console.log("Votes updated");

    try {

        let recc = await reccomendation.findOne({ userId: req.user._id });
        let cat = await postCluster.findOne({ postid: id });


        // console.log({ cat });
        let cluster = cat.cluster;
        let newRecc = recc.recc;
        let updatedVal = newRecc[cluster];

        if (dec) {
            updatedVal.count--;
        } else {
            updatedVal.count++;
        }

        // console.log("clutstere", newRecc[cluster]);
        await reccomendation.findOneAndUpdate({ userId: req.user._id }, { recc: newRecc })

    }
    catch (e) {
        console.log({ err: e });
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


    //deprecated
    // let searchQuery = {
    //     user: { $in: req.user.follows },

    //     $or: [
    //         {
    //             text: { $regex: search },
    //         },
    //         {
    //             title: { $regex: search }
    //         }
    //     ]
    // };

    let followers = await userFollow.find({ userId: req.user.id });

    let follows = followers.map((x) => {
        return x.followId;
    });


    let searchQuery = { user: { $in: follows } };


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

let savePostCluster = async (id) => {

    console.log("Starting to generate post cluster");

    let data;
    //shoudld use python command windows or python3 linux
    let python = process.env.PYTHON || 'python';

    console.log("Spawning script", python);

    const script = spawn(python, ['ml/find_cluster.py', id]);

    script.stdout.on('data', (localData) => {
        data = localData.toString();
        console.log("ran", data);
    });

    script.stderr.on('data', (localData) => {
        data = localData.toString();
        console.log("Error", data);
    });

    script.stdout.on('close', () => {
        console.log('closing');
    });


}

let getReccomendedPost = async (req, res) => {

    let uid = req.user.id;
    let recc = await reccomendation.findOne({ userId: uid });

    let page = req.query.page || 0;
    let sort = req.query.sort;

    console.log({ page, sort });

    let reccArr = recc.recc;

    reccArr.sort((a, b) => {
        return b.count - a.count;
    });

    let topRecc = [];
    for (let i = 0; i < 3; i++) {
        topRecc.push(reccArr[i].id.toString());
    }

    // console.log(reccArr, topRecc);

    let posts = await postCluster.find({ cluster: { $in: topRecc } });

    // console.log({ posts });

    let postsId = []

    for (let i = 0; i < posts.length; i++) {
        postsId.push(posts[i].postid);
    }

    let limit = 10;

    let count = await post.find({ _id: { $in: postsId } }).count();
    count = Number.parseInt(count / limit);

    posts = await post
        .find({ _id: { $in: postsId } })
        .populate('tag user')
        .skip(page * limit)
        .limit(limit)

    // console.log({ postsId, posts }); 

    res.send({
        success: {
            posts: posts,
            count
        }
    });
}

module.exports = { createPost, getPost, addComment, removePost, getPostById, getPostByUserId, updateVotes, generateFeed, getPostByTag, savePostCluster, getReccomendedPost };