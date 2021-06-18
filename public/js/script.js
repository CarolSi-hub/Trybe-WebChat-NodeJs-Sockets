const socket = window.io();
        
const usersOnline = document.querySelector('#userList');

const sendMessageButton = document.querySelector('#sendMessageButton');
const updateNickNameButton = document.querySelector('#updateNickName');

const messageInput = document.querySelector('#messageInput');
const messages = document.querySelector('#messagesList');

const newNickName = document.querySelector('#newNickName');

socket.on('connect', () => {
 const nickname = socket.id.slice(0, 16);
 sessionStorage.setItem('user', nickname);
 socket.emit('newUserEntry', nickname);     
});

socket.on('usersList', (users) => {  
    usersOnline.innerHTML = '';
    const currentUser = users.find((usr) => usr.socketId === socket.id);
    const filteredUsers = users.filter((usr) => usr.socketId !== socket.id);
    filteredUsers.unshift(currentUser);
    filteredUsers.forEach((element) => {
        const user = document.createElement('li');
        user.innerHTML = `${element.nickname}`;
        user.setAttribute('data-testid', 'online-user');
        usersOnline.appendChild(user);
    });
});

sendMessageButton.addEventListener('click', () => {
    const chatMessage = messageInput.value;
    const nickname = sessionStorage.getItem('user');
    socket.emit('message', { chatMessage, nickname });
});

socket.on('message', (message) => {  
    const messageElement = document.createElement('li');
    messageElement.innerHTML = message;
    messageElement.setAttribute('data-testid', 'message');
    messages.appendChild(messageElement);
});

updateNickNameButton.addEventListener('click', () => {
    const nickName = newNickName.value;
    sessionStorage.setItem('user', nickName);
    socket.emit('updateNickname', nickName);
});
