document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el socket.io
    const socket = io();

    let salaActual = 'General';
    let nombreUsuario = '';

    let historialMensajes = JSON.parse(localStorage.getItem('chat_history')) || []; 

    while (!nombreUsuario) {
        nombreUsuario = prompt('Ingrese su nombre de usuario para el Chat:');
    }

    // Unirse automáticamente a la sala por defecto
    socket.emit('joinRoom', salaActual, nombreUsuario);
    document.getElementById('room-title').textContent = `Sala: ${salaActual}`;
    cargarMensajesLocales();

    // --- MANEJO DE ENVIAR MENSAJES Y EMOJIS ---
    document.getElementById('message-form').addEventListener('submit', (e) => {
        
        e.preventDefault();

        const messageInput = document.getElementById('message-input');
        const message = messageInput.value;
        
        // Enviar mensaje al servidor junto con el remitente
        socket.emit('sendMessage', { user: nombreUsuario, text: message }, salaActual);
        messageInput.value = '';
    });

    // Emojis
    document.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const messageInput = document.getElementById('message-input');
            messageInput.value += btn.textContent;
            messageInput.focus();
        });
    });

    // --- RECEPCIÓN DE EVENTOS (SOCKETS) ---
    socket.on('message', (data) => {
        
        historialMensajes.push({ room: salaActual, user: data.user, text: data.text, time: new Date().toLocaleTimeString() });
        localStorage.setItem('chat_history', JSON.stringify(historialMensajes));

        dibujarMensaje(`${data.user}: ${data.text}`);
        
        reproducirNotificacion();
    });

    socket.on('userJoined', (username) => {
        dibujarMensaje(`* ${username} se ha unido a la sala *`, true);
        reproducirNotificacion();
    });

    function dibujarMensaje(texto, esSistema = false) {
        const messageContainer = document.getElementById('message-container');
        const messageElement = document.createElement('div');
        messageElement.textContent = texto;
        if (esSistema) messageElement.style.fontStyle = 'italic';
        
        messageContainer.appendChild(messageElement);
        // Auto-scroll hacia abajo al recibir mensaje nuevo
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }

    // Notificación Sonora
    function reproducirNotificacion() {
        const sonido = document.getElementById('notif-sound');
        sonido.play().catch(err => console.log("Interacción previa requerida para el sonido"));
    }

    // --- CAMBIAR DE SALAS ---
    const roomsList = document.getElementById('rooms');
    const rooms = ['General', 'Sports', 'Technology'];


    rooms.forEach(room => {
        const roomElement = document.createElement('li');
        roomElement.textContent = room;
        roomElement.addEventListener('click', () => cambiarSala(room));
        roomsList.appendChild(roomElement);
    });

    function cambiarSala(nuevaSala) {
        if (nuevaSala === salaActual) return;
        
        salaActual = nuevaSala;
        document.getElementById('room-title').textContent = `Sala: ${salaActual}`;
        document.getElementById('message-container').innerHTML = ''; // Limpiar pantalla
        
        socket.emit('joinRoom', salaActual, nombreUsuario);
        cargarMensajesLocales(); // Cargar los mensajes guardados de esta sala
    }

    // Historial del Cliente
    function cargarMensajesLocales() {
        const mensajesFiltrados = historialMensajes.filter(m => m.room === salaActual);
        mensajesFiltrados.forEach(m => {
            dibujarMensaje(`${m.user}: ${m.text}`);
        });
    }

    // Buscador en el historial
    document.getElementById('search-btn').addEventListener('click', () => {
        const busqueda = document.getElementById('search-input').value.toLowerCase();
        const resultadosDiv = document.getElementById('search-results');
        resultadosDiv.innerHTML = '';
        
        if(!busqueda) return;

        const filtrados = historialMensajes.filter(m => m.text.toLowerCase().includes(busqueda));
        
        if(filtrados.length === 0) {
            resultadosDiv.innerHTML = '<p>No hay resultados</p>';
        } else {
            filtrados.forEach(m => {
                const p = document.createElement('p');
                p.textContent = `[${m.room}] ${m.user}: ${m.text}`;
                resultadosDiv.appendChild(p);
            });
        }
    });

    // Scroll Infinito simulado en el Frontend
    // Cuando el usuario sube al tope (scrollTop === 0), simulamos cargar mensajes más antiguos.
    document.getElementById('message-container').addEventListener('scroll', (e) => {
        if (e.target.scrollTop === 0) {
            // En un entorno escolar, basta con mostrar un indicador o alertar que se cargó el historial previo
            console.log("Cargando mensajes más antiguos del historial...");
            // Para simularlo visualmente de forma sencilla:
            const aviso = document.createElement('div');
            aviso.textContent = "--- Fin del historial antiguo ---";
            aviso.style.textAlign = "center";
            aviso.style.fontSize = "12px";
            e.target.prepend(aviso);
        }
    });
});