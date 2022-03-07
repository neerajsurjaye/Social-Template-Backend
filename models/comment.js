const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const comment = new Schema({
    text: String,
    user: { type: Schema.Types.ObjectId, rel: 'user' },
    date: { type: Date, default: Date.now },
    votes: Number
})

const commentModel = mongoose.model('comment', comment);

module.exports = commentModel;