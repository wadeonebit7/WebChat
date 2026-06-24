// server.js
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
        if (!rooms[room]) rooms[room] = [];
        rooms[room].push(username);
        io.to(room).emit('userJoined', username);
    });

    socket.on('sendMessage', (message, room) => {
        io.to(room).emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
        // Lógica para manejar la desconexión y actualizar las salas
    });
});

server.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
