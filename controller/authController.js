const bcrypt = require('bcryptjs');
const user = require('../models/user');
const jwt = require('jsonwebtoken');


//checks if request is authnticated to proceed
let isAuth = async (req, res, next) => {

    let token = req.headers.authorization;
    let key = process.env.SALT;

    // console.log("tken ", token);

    let tokenData;
    let userData;
    try {
        tokenData = await jwt.verify(token, key);

        userData = await user.findOne({ username: tokenData.username });

        if (!userData) {
            res.json({
                err: "Invalid user"
            })
            return;
        }

    } catch {
        res.json({
            err: "Invalid token"
        })
        return;
    }

    req.user = userData;

    next();
}

//handles login
let login = async (req, res) => {

    let username = req.body.username;
    let password = req.body.password;


    let currUser = await user.findOne({ username: username });

    if (!currUser) {
        res.json({
            err: "invalid user"
        })
        return;
    }

    let key = process.env.SALT;
    let isMatch = await bcrypt.compare(password, currUser.password);

    let tokenObj = {
        username: currUser.username,
        name: currUser.name
    }

    if (isMatch) {
        let token = await jwt.sign(tokenObj, key);
        res.json({
            success: token
        })
        return;
    }

    res.json({
        err: "Invalid password",
    });

}

module.exports = { login, isAuth };