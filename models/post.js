const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const post = new Schema({
    text: String,
    title: String,
    votes: { type: Number, default: 0 },
    // comments: [{ type: Schema.Types.ObjectId, ref: 'comment' }],
    date: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    tag: [{ type: Schema.Types.ObjectId, ref: 'tag' }]
})

const postModel = mongoose.model('post', post);

module.exports = postModel;

