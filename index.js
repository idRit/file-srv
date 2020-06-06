require('dotenv').config()

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectToDB = require('./mongo.client');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));

app.get('/', (req, res) => {
    return res.json({
        working: true
    });
});

connectToDB(app, process.env.MONGO_URI);

app.listen(3000);
console.log("running");