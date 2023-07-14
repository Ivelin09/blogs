const express = require('express');
const server = express();

const mongoose = require('mongoose');
const { User } = require('./schemas/blogs')

const jwt = require("jsonwebtoken");

mongoose.connect('mongodb://localhost:27017/blogs');

const cors = require('cors');
const bodyParser = require('body-parser');


server.use(cors());


server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.post('/register', express.json(), async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    console.log("username", username);

    const token = await jwt.sign({ username: username }, 'secret', { expiresIn: 1000 * 60 * 30 * 1000000000000000 });
    const doc = new User();
    doc.username = username;
    doc.password = password;
    try {
        await doc.save().then(() => console.log("saved"));
    } catch (err) {
        console.log("Err", err);
        res.json({
            status: 401,
            message: 'This username is taken'
        });
        return;
    }
    console.log(doc);
    res.json({
        status: 200,
        message: "success",
        token: token
    });
});

server.listen(8000, () => {
    console.log('Server is on')
})