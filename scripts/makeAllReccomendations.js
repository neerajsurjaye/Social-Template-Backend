const user = require('../models/user');
const userController = require('../controller/userController');


const run = async () => {

    const mongoose = require('mongoose');


    mongoose.connect('mongodb://127.0.0.1:27017/social-template');

    let users = await user.find();

    for (let x in users) {
        x = users[x];

        let res = await userController.makeReccomendation(x._id);
        console.log("Created : ", res);
    }

}

module.exports = { run };