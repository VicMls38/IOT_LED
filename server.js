const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: { origin: "*" } // Permet à l'ESP32 de se connecter
});

const port = 2002;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Routes pour chaque couleur
app.get('/vert', (req, res) => {
    console.log(`LED Vert allumée`);
    io.emit('updateLED', 'vert');
    res.send("LED Verte allumée !");
});
app.get('/jaune', (req, res) => {
    console.log(`LED Jaune allumée`);
    io.emit('updateLED', 'jaune');
    res.send("LED Jaune allumée !");
});
app.get('/rouge', (req, res) => {
    console.log(`LED Rouge allumée`);
    io.emit('updateLED', 'rouge');
    res.send("LED Rouge allumée !");
});

io.on('connection', (socket) => {
    console.log('Un appareil est connecté');

    socket.on('toggleLED', (state) => {
        console.log(`Commande reçue pour LED : ${state}`);
        io.emit('updateLED', state); // Diffuse l'état à tous les clients connectés
    });

    socket.on('disconnect', () => {
        console.log('Un appareil s\'est déconnecté');
    });
});

server.listen(port, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`);
});
