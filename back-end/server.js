const express = require('express');
const app = express();

const mongoose = require('mongoose');
const cors = require('cors');

const path = require('path');
const http = require('http');
const server = http.createServer(app);

const blogRoute = require('./routes/blog.route');
const commentRoute = require('./routes/comment.route');
const loginRoute = require('./routes/login.route');
const usersRoute = require('./routes/users.route');

const io = require("socket.io")(server);

io.on('connection', (socket) => {
    socket.on('typer', (data) => {
        io.to(data.blog).emit('typer', {
            username: data.username
        });
        socket.join(data.blog);
    });

    socket.on('typerQuit', (data) => {
        socket.leave(data.blog);
    });
});

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

mongoose.connect('mongodb://localhost:27017/blogs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(blogRoute, commentRoute, loginRoute, usersRoute);

server.listen(8000, () => {
    console.log('Server is on')
})