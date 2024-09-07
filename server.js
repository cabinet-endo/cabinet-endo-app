const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const db = require('./database');
const apiRoutes = require('./routes/api');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use('/api', apiRoutes);

io.on('connection', (socket) => {
  console.log('Nouveau client connecté');

  socket.on('send_command', (data) => {
    io.emit('new_command', data);
  });

  socket.on('task_completed', (data) => {
    io.emit('update_task', data);
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});