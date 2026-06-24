// script.js
const socket = io();

document.getElementById('message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;
    const room = getCurrentRoom(); // Implementar esta función
    socket.emit('sendMessage', message, room);
    messageInput.value = '';
});

socket.on('message', (message) => {
    const messageContainer = document.getElementById('message-container');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);
});

const roomsList = document.getElementById('rooms');
const rooms = ['General', 'Sports', 'Technology']; // Ejemplo de salas

rooms.forEach(room => {
    const roomElement = document.createElement('li');
    roomElement.textContent = room;
    roomElement.addEventListener('click', () => joinRoom(room));
    roomsList.appendChild(roomElement);
});

function joinRoom(room) {
    const username = prompt('Ingrese su nombre de usuario:');
    socket.emit('joinRoom', room, username);
}

socket.on('userJoined', (username) => {
    const messageContainer = document.getElementById('message-container');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${username} se ha unido a la sala`;
    messageContainer.appendChild(messageElement);
});

function getCurrentRoom() {
    // Implementar lógica para obtener la sala actual
    // Esto podría ser almacenado en una variable global
    return 'General'; // Ejemplo de sala por defecto
}
