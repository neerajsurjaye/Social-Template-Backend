const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tag = new Schema({
    name: String
})

const tagModel = mongoose.model('tag', tag);

module.exports = tagModel;