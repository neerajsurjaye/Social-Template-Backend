const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const post = new Schema({
    text: String,
    votes: Number,
    comments: [{ type: Schema.Types.ObjectId, req: 'comment' }],
    date: Date,
    user: { type: Schema.Types.ObjectId, req: 'user' },
    tag: [{ type: Schema.Types.ObjectId, req: 'tag' }]
})

const postModel = mongoose.model('post', post);

module.exports = postModel;