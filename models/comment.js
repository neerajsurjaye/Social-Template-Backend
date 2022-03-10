const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const comment = new Schema({
    text: String,
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    date: { type: Date, default: Date.now },
    votes: { type: Number, default: 0 }
})

const commentModel = mongoose.model('comment', comment);

module.exports = commentModel;