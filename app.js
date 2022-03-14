const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

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


mongoose.connect('mongodb://127.0.0.1:27017/social-template');

app.get('/', (req, res) => {
    res.send('FrontEnd');
})

app.use('/api', api);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listning on ${port}`);
})