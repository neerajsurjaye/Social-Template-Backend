const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const votesMap = new Schema({

    userId: { type: Schema.Types.ObjectId, ref: 'user' },
    status: Number

})


module.exports = mongoose.model('votesmap', votesMap); 