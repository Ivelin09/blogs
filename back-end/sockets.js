const socketListen = (server) => {
    const http = require('http');
    const io = require("socket.io")(server);

    io.on('connection', (socket) => {

        socket.on('blogConnect', (data) => {
            socket.join(data.blog);
        });

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

};

module.exports = socketListen;