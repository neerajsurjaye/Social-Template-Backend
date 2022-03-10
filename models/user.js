const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');

const user = new Schema({
    username: String,
    name: String,
    profile_pic: { type: String, default: null },
    posts: [{ type: mongoose.Types.ObjectId, ref: 'post', default: 0 }],
    follows: [{ type: mongoose.Types.ObjectId, ref: 'user', default: 0 }],
    password: String,
    likes: { type: Number, default: 0 },
})

const userModel = mongoose.model('user', user);

module.exports = userModel;