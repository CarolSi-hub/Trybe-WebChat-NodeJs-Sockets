const express = require('express');
const dateFormat = require('dateformat');
const path = require('path');

const app = express();

const http = require('http').createServer(app);

const io = require('socket.io')(http, {
    cors: {
      origin: 'http://localhost:3000', // url aceita pelo cors
      methods: ['GET', 'POST'], // Métodos aceitos pela url
    } });
    
    const messagesModel = require('./models/messagesModel');

    let users = [];

    io.on('connection', (socket) => {
        socket.on('newUserEntry', (nickname) => {
            users = [...users, { socketId: socket.id, nickname }];
            io.emit('usersList', users);
        });      
        socket.on('message', async ({ chatMessage, nickname }) => {
            const timestamp = dateFormat(new Date(), 'dd-mm-yyyy hh:MM:ss'); 
            await messagesModel.create({ message: chatMessage, nickname, timestamp });            
            io.emit('message', `${timestamp} ${nickname} ${chatMessage}`);
        });
        socket.on('updateNickname', (nickname) => {      
            const userPosition = users.indexOf(users.find((user) => user.socketId === socket.id));
            users[userPosition].nickname = nickname;
            io.emit('usersList', users);
        });
        socket.on('disconnect', () => {
            users = users.filter((user) => user.socketId !== socket.id);
            io.emit('usersList', users);
        });
    });

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', async (_req, res) => { 
    const messages = await messagesModel.getAllMessages();
  res.render('index', { messages });
});

const PORT = process.env.PORT || 3000;  

http.listen(PORT, () => {
    console.log(`Running server on port ${PORT}`);
  });