const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let rooms = {};

io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');

    socket.on('joinRoom', (room, username) => {
        socket.join(room);
        socket.nombreUsuario = username;
        socket.salaUsuario = room;

        if (!rooms[room]) rooms[room] = [];
        if (!rooms[room].includes(username)) rooms[room].push(username);

        io.to(room).emit('userJoined', username);
    });

    socket.on('sendMessage', (messageData, room) => {
        io.to(room).emit('message', messageData);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
        if (socket.salaUsuario && socket.nombreUsuario) {
            io.to(socket.salaUsuario).emit('message', {
                user: 'Sistema',
                text: `${socket.nombreUsuario} ha abandonado la sala.`
            });
        }
    });
});

server.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
