document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const registrationDiv = document.getElementById('registration');
    const usernameInput = document.getElementById('usernameInput');
    const roomInput = document.getElementById('roomInput');
    const joinBtn = document.getElementById('joinBtn');

    const chatSection = document.getElementById('chatSection');
    const chat = document.getElementById('chat');
    const onlineUsersDiv = document.getElementById('online-users');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const adminBtn = document.getElementById('adminBtn');
    const switchRoomBtn = document.getElementById('switchRoomBtn');
    const disconnectBtn = document.getElementById('disconnectBtn');

    let username = '';
    let room = '';
    let isAdmin = false;

    joinBtn.addEventListener('click', () => {
        username = usernameInput.value.trim();
        room = roomInput.value.trim() || 'global';
        if (!username) {
            alert("Please enter a username!");
            return;
        }

        isAdmin = username.toLowerCase() === 'admin';

        registrationDiv.style.display = 'none';
        chatSection.style.display = 'block';

        socket.emit('register', username, isAdmin, room);
    });

    socket.on('chatMessage', (msg) => {
        if (!chat) return;
        const msgDiv = document.createElement('div');
        if(msg.user === 'System'){
            msgDiv.style.fontStyle = 'italic';
            msgDiv.style.color = '#555';
        } else if(msg.user === 'Admin'){
            msgDiv.style.fontWeight = 'bold';
            msgDiv.style.color = '#d63384';
        }
        msgDiv.textContent = `[${new Date(msg.time).toLocaleTimeString()}] ${msg.user}: ${msg.text}`;
        chat.appendChild(msgDiv);
        chat.scrollTop = chat.scrollHeight;
    });

    socket.on('onlineUsers', (users) => {
        if (!onlineUsersDiv) return;
        onlineUsersDiv.textContent = `Online Users (${room}): ` + users.join(', ');
    });

    socket.on('chatHistory', (history) => {
        if (!chat) return;
        chat.innerHTML = '';
        history.forEach(msg => {
            const msgDiv = document.createElement('div');
            if(msg.user === 'System'){
                msgDiv.style.fontStyle = 'italic';
                msgDiv.style.color = '#555';
            } else if(msg.user === 'Admin'){
                msgDiv.style.fontWeight = 'bold';
                msgDiv.style.color = '#d63384';
            }
            msgDiv.textContent = `[${new Date(msg.time).toLocaleTimeString()}] ${msg.user}: ${msg.text}`;
            chat.appendChild(msgDiv);
        });
        chat.scrollTop = chat.scrollHeight;
    });

    sendBtn.addEventListener('click', () => {
        const msg = messageInput.value.trim();
        if (msg) {
            socket.emit('chatMessage', msg);
            messageInput.value = '';
        }
    });

    adminBtn.addEventListener('click', () => {
        if (!isAdmin) {
            alert("Only admin can send broadcast messages!");
            return;
        }
        const msg = prompt("Enter admin message:");
        if (msg && msg.trim() !== '') {
            socket.emit('adminMessage', msg.trim());
        }
    });

    switchRoomBtn.addEventListener('click', () => {
        const newRoom = prompt("Enter new room name:");
        if (newRoom && newRoom.trim() !== '') {
            room = newRoom.trim();
            socket.emit('switchRoom', room);
        }
    });

    disconnectBtn.addEventListener('click', () => {
        socket.disconnect();
        alert("Disconnected!");
        location.reload();
    });
});
