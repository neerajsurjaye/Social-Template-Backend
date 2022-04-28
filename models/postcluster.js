const { default: mongoose } = require('mongoose');
let mongooe = require('mongoose');
let Schema = mongooe.Schema;

let postcluster = new Schema({
    postid: String,
    cluster: String
})

let model = mongoose.model('postcluster', postcluster);

module.exports = model;