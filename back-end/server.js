const express = require('express');
const server = express();

const mongoose = require('mongoose');
const { User } = require('./schemas/blogs')

const jwt = require("jsonwebtoken");
const Cookies = require('cookies');

mongoose.connect('mongodb://localhost:27017/blogs');

const cors = require('cors');
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser')

server.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
server.use(cookieParser());

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.post('/register', async (req, res) => {
    const { username, password } = req.body;

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

    res.json({
        status: 200,
        message: "success",
        token: token
    });

    server.listen(8000, () => {
        console.log('Server is on')
    })