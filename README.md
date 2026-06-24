#   WebChat (Chat en Tiempo Real)

Aplicación web de chat interactivo por salas en tiempo real con almacenamiento local, búsqueda de historial y notificaciones mediante WebSockets.

## Tecnologías

- **Frontend:** HTML, CSS, JavaScript (DOM)
- **Backend:** Node.js, Express.js
- **Almacenamiento:** LocalStorage (Historial en cliente)
- **Tiempo real:** Socket.io

## Requisitos previos

- Node.js v18 o superior

## Instalación


1. Clona el repositorio e instala las dependencias:

```bash
git clone <url-del-repositorio>
cd web-chat
npm install
```

2. Inicia el servidor:

```bash
node server.js
```

5. Abre el navegador en `http://localhost:3000`

## Estructura del proyecto

```
web-chat/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── index.html
│   └── script.js
├── server.js
├── package-lock.json
├── package.json
└── README.md
```

## Eventos de Socket (WebSocket)

| Evento | Dirección | Descripción |
|--------|------|-------------|
| `joinRoom` | `Cliente -> Servidor` | Conecta al usuario a una sala específica (General, Sports, Technology) |
| `sendMessage` | `Cliente -> Servidor` | Envía un objeto con el mensaje escrito y el nombre del usuario |
| `message` | `Servidor -> Cliente` | Transmite el mensaje recibido a todos los miembros de la sala activa |
| `userJoined` | `Servidor -> Cliente` | Alerta a la sala que un nuevo usuario se ha integrado |

## Funcionalidades

- Registro obligatorio de un nombre de usuario por pantalla antes de ingresar a las salas.
- Cambio de canales interactivo limpiando la interfaz para no mezclar contenidos.
- Los mensajes se guardan en el localStorage del cliente para no perder la información al recargar.
- Filtro por texto integrado para ubicar mensajes específicos dentro del historial guardado.
- Inserción directa de emojis nativos en el campo de texto mediante botones interactivos.
- Reproducción de alertas sonoras y estilos visuales al recibir mensajes nuevos o conexiones.
- Detección del tope superior del chat para activar la carga de mensajes antiguos.