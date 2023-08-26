const express = require('express');
const app = express();

const server = require('http').createServer(app);
require('./sockets.js').socketListen(server);

const mongoose = require('mongoose');

const path = require('path');

const blogRoute = require('./routes/blog.route');
const commentRoute = require('./routes/comment.route');
const loginRoute = require('./routes/login.route');
const usersRoute = require('./routes/users.route');


mongoose.connect('mongodb://localhost:27017/blogs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(blogRoute, commentRoute, loginRoute, usersRoute);


server.listen(8000, () => {
    console.log('Server is on')
})