const bcrypt = require('bcryptjs');
const { json } = require('express/lib/response');
const user = require('../models/user');
const reccomendation = require('../models/userReccomendation');
const userFollow = require('../models/userFollow');
const req = require('express/lib/request');
const res = require('express/lib/response');

let createUser = async (req, res) => {

    let userData = req.body;

    let hashedPassword = await bcrypt.hash(userData.password, 10);

    let userPres = await user.findOne({
        username: userData.username
    })

    if (userPres) {
        res.json({
            err: "User already exists"
        })
        return;
    }


    let newUser = new user({
        username: userData.username,
        password: hashedPassword,
        name: userData.name
    })

    newUser = await newUser.save();
    await makeReccomendation(newUser._id);

    res.json({
        success: "User created"
    })
}

let makeReccomendation = async (id) => {

    let recc = [];
    for (let i = 0; i <= 25; i++) {
        recc[i] = {
            id: i,
            count: 0
        };
    }

    let newUser = new reccomendation({
        userId: id,
        recc: recc
    })

    let res = await newUser.save();

    // console.log("New recc", res);
    return res;
}

let getUserById = async (req, res) => {

    let id = req.params.id;

    let currUser;
    try {
        currUser = await user.findById(id)
            .select('username name profile_pic posts follows likes')
    }
    catch {
        if (!currUser) {
            res.send({
                err: "Invalid user id"
            })
            return;
        }
    }

    if (!currUser) {
        res.send({
            err: "Invalid user id"
        })
        return;
    }

    res.send({
        success: currUser
    })
}

let getUserByName = async (req, res) => {

    let name = req.query.name;
    let username = req.query.username;

    // console.log(name, username);

    if (!name && !username) {
        res.send({
            err: "Invalid name"
        })
        return;
    }

    let currUser = await user.findOne({ $or: [{ name: name }, { username: username }] })
        .select('username name profile_pic posts follows likes');

    console.log(currUser);

    res.json({
        success: currUser
    })
}

let getCurrentUser = (req, res) => {

    res.json({
        success: req.user,
    })

}

let followUser = async (req, res) => {

    let followId = req.params.id;
    let userId = req.user._id;

    // console.log({ followId, userId });

    if (followId == userId) {
        res.json({
            err: "Cant follow yourself"
        })
        return;
    }

    // let exists = await user.find({
    //     follows : {
    //         $in : []
    //     }
    // })

    //deprecated
    // let result = await user.updateOne({ _id: userId },
    //     {
    //         $addToSet: {
    //             follows: followId
    //         }
    //     });

    // console.log({ result });


    // console.log("following");
    let follows = await userFollow.findOne({ userId: userId, followId: followId });


    if (follows) {

        await userFollow.deleteOne({ userId: userId, followId: followId });
        res.json({
            sucess: "deleted"
        })
        return;

    }

    let follow = new userFollow({
        userId: userId,
        followId: followId
    })

    await follow.save();

    // console.log("Followed");

    res.json({
        success: "followed"
    })

}

let follows = async (req, res) => {

    let id = req.params.id || req.query.id;

    let follow = await userFollow.findOne({
        userId: req.user.id,
        followId: id
    })

    let follows = follow ? true : false;

    res.json({
        success: follows
    })

}

module.exports = { createUser, getUserById, getUserByName, getCurrentUser, followUser, makeReccomendation, follows };