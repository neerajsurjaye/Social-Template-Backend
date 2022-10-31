const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path')

dotenv.config();

//importing models
const user = require('./models/user');
const post = require('./models/post');
const tag = require('./models/tag');
const comment = require('./models/comment');

//middlewares
app.use(cors());
app.use(express.json());


//importing controllers
const api = require('./routes/api');


const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/social-template';

mongoose.connect(mongoUrl);

app.use(express.static(path.join(__dirname, 'static', 'build')))


app.use('/api', api);

app.get('/*', (req, res) => {
    let dir = (path.join(__dirname, 'static', 'build', 'index.html'));
    // console.log(dir);
    res.sendFile(dir);
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listning on ${port}`);
})