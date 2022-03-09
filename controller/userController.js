const bcrypt = require('bcryptjs');
const user = require('../models/user');

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

    res.json({
        success: "User created"
    })
}

let getUserById = async (req, res) => {

    let id = req.params.id;

    let currUser;
    try {
        currUser = await user.findById(id)
            .select('username name profile_pic posts follows likes');
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

    console.log(name, username);

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

module.exports = { createUser, getUserById, getUserByName };