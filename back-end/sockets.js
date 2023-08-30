const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const User = require('./schemas/users');
const Blogs = require('./schemas/blogs');

const userData = {};
let http, io;

const socketListen = (server) => {
    http = require('http'), io = require("socket.io")(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true

        }
    });

    module.exports.http = http;
    module.exports.io = io;

    io.use(async (socket, next) => {
        if (!socket.handshake.headers.cookie) {
            next();
            return;
        }

        const hashedAccessToken = socket.handshake.headers.cookie.split("=")[1];

        const accessToken = jwt.verify(hashedAccessToken, 'secret');
        const senderObj = await User.findOne({ username: accessToken.username });

        socket.user = senderObj;
        next();
    });

    io.on('connection', (socket) => {
        socket.on('blogConnect', (data) => {
            if (userData[socket.id])
                return;
            socket.join(data.blog);
        });

        socket.on('connection', async () => {
            socket.emit('connected');
            socket.join('page');


            if (socket.user) {



                userData[socket.id] = {
                    id: socket.id,
                    user: socket.user,
                    timeout: setInterval(() => {
                        console.log('offline');

                        if (userData[socket.id].timeout)
                            clearInterval(userData[socket.id].timeout)

                        for (const key in userData)
                            if (userData[key].user.username == socket.user.username && socket.id != userData[key].id) {
                                delete userData[socket.id];
                                return;
                            }
                        io.to('page').emit('leave', {
                            user: socket.user.username
                        })
                        delete userData[socket.id];

                        socket.disconnect();
                    }, 5000)
                }

                console.log('online');
                io.to('page').emit('online', {
                    user: socket.user
                });
            }


        })

        socket.on('online', () => {
            if (!socket.user)
                return;

            if (userData[socket.id]) {
                console.log('re-onlined')
                clearInterval(userData[socket.id].timeout)
                userData[socket.id].timeout = setInterval(() => {

                    console.log('offline');
                    if (userData[socket.id].timeout)
                        clearInterval(userData[socket.id].timeout)

                    for (const key in userData)
                        if (userData[key].user.username == socket.user.username && socket.id != userData[key].id) {
                            delete userData[socket.id];
                            return;
                        }
                    io.to('page').emit('leave', {
                        user: socket.user
                    })
                    delete userData[socket.id];

                    socket.disconnect();
                }, 5000)
            }
        })

        socket.on('comment', (data) => {
            io.to(data.blog).emit('comment', data);
        })

        socket.on('typer', (data) => {
            io.to(data.blog).emit('typer', {
                username: data.username
            });
        });

        socket.on('typerQuit', (data) => {
            io.to(data.blog).emit('typerQuit', {
                username: data.username
            })
        });

        socket.on('searching', async (data) => {
            console.log('asdasd')
            let blogs = await Blogs.find({
                title: {
                    $regex: `^${data.search}`
                }
            });

            console.log('blogs', blogs);

            io.to(socket.id).emit("suggestions", {
                message: blogs
            });
        });
    });

    io.on('disconnect', () => {
        console.log('try me!');
    })
};

module.exports = { userData, socketListen, http, io };