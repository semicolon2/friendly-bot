import express from 'express';
const app = express()
require('dotenv').config();

app.get('/', (req, res) => {
    res.send('hello world!');
});

app.listen(process.env.PORT, err => {
    if(err) console.error(err);
    console.log('listening on port ' + process.env.PORT);
});