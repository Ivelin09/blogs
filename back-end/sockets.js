const cookie = require('cookie');

const userData = new Map();

const socketListen = (server) => {
    const http = require('http');
    const io = require("socket.io")(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true

        }
    });

    io.on('connection', (socket) => {
        console.log('here')
        socket.on('blogConnect', (data) => {
            socket.join(data.blog);
        });

        socket.on('connection', () => {
            console.log('ehre?');
            socket.join('page');
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
    });
    return { io };
};

module.exports = socketListen;