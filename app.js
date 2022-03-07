const express = require('express');
const app = express();


app.get('/', (req, res) => {
    res.send('Listning')
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listning on ${port}`);
})