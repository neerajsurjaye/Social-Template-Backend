let post = require('../models/post');
let user = require('../models/user');
let { spawn } = require('child_process');



let run = async () => {

    const mongoose = require('mongoose');


    mongoose.connect('mongodb://127.0.0.1:27017/social-template');

    console.log("ran");
    let currPost = await post.find();

    console.log("len : ", currPost.length);

    for (let i = 0; i < currPost.length; i++) {
        console.log("Working on : ", i, currPost[i].text + " " + currPost[i].title);
        let id = currPost[i]._id;
        let savePost = spawn('python', ['ml/find_cluster.py', id]);

        savePost.stdout.on('data', (data) => {
            console.log("saved", i, data.toString());
        })
        savePost.stderr.on('data', (data) => {
            console.log("err", data.toString());
        })
    }

}

module.exports = { run };