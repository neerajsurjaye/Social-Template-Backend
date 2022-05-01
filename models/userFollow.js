const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userFollow = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
    followId: { type: Schema.Types.ObjectId, ref: 'user' }
})

module.exports = mongoose.model('userfollow', userFollow);