let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userReccomendation = new Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'user' },
    recc: [{ type: Object }]
})

let model = mongoose.model('reccomendation', userReccomendation);
module.exports = model;