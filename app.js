const express = require('express');
const app = express();
const mongoose = require('mongoose');

const user = require('./models/user')

mongoose.connect('mongodb://127.0.0.1:27017/social-template');

app.get('/', (req, res) => {
    res.send('Listning')
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listning on ${port}`);
})