const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const user = new Schema({
    username: String,
    name: String,
    profile_pic: String,
    posts: [{ type: mongoose.Types.ObjectId, ref: 'post' }],
    follows: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    password: String,
    likes: Number
})

const userModel = mongoose.model('user', user);

module.exports = userModel;