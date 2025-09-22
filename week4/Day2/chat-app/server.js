const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const onlineUsers = new Map(); 
const rooms = new Map(); 
function getUniqueUsername(name, room) {
    const usersInRoom = Array.from(onlineUsers.values())
        .filter(u => u.room === room)
        .map(u => u.username);

    if (!usersInRoom.includes(name)) return name;

    let counter = 1;
    let newName = `${name}#${counter}`;
    while (usersInRoom.includes(newName)) {
        counter++;
        newName = `${name}#${counter}`;
    }
    return newName;
}

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('register', (username, isAdmin = false, room = 'global') => {
        username = getUniqueUsername(username, room);
        onlineUsers.set(socket.id, { username, isAdmin, room });
        socket.join(room);

        console.log(`${username} joined room: ${room}`);


        io.to(room).emit(
            'onlineUsers',
            Array.from(onlineUsers.values())
                .filter(u => u.room === room)
                .map(u => u.username)
        );

        if (!rooms.has(room)) rooms.set(room, []);
      
        socket.emit('chatHistory', rooms.get(room));

      
        const joinMsg = { user: 'System', text: `${username} joined the room!`, time: new Date() };
        rooms.get(room).push(joinMsg);
        io.to(room).emit('chatMessage', joinMsg);
    });

    socket.on('chatMessage', (msg) => {
        const user = onlineUsers.get(socket.id);
        if (!user) return;

        const messageData = { user: user.username, text: msg, time: new Date() };
        rooms.get(user.room).push(messageData);
        io.to(user.room).emit('chatMessage', messageData);
    });

    socket.on('adminMessage', (msg) => {
        const user = onlineUsers.get(socket.id);
        if (user && user.isAdmin) {
            const messageData = { user: 'Admin', text: msg, time: new Date() };
            rooms.get(user.room).push(messageData);
            io.to(user.room).emit('chatMessage', messageData);
        }
    });

    socket.on('switchRoom', (newRoom) => {
        const user = onlineUsers.get(socket.id);
        if (!user) return;

        const oldRoom = user.room;
        socket.leave(oldRoom);
        user.room = newRoom;
        socket.join(newRoom);

       
        io.to(oldRoom).emit(
            'onlineUsers',
            Array.from(onlineUsers.values())
                .filter(u => u.room === oldRoom)
                .map(u => u.username)
        );

       
        io.to(newRoom).emit(
            'onlineUsers',
            Array.from(onlineUsers.values())
                .filter(u => u.room === newRoom)
                .map(u => u.username)
        );

        if (!rooms.has(newRoom)) rooms.set(newRoom, []);
        
        socket.emit('chatHistory', rooms.get(newRoom));

        
        const switchMsg = { user: 'System', text: `${user.username} joined the room!`, time: new Date() };
        rooms.get(newRoom).push(switchMsg);
        io.to(newRoom).emit('chatMessage', switchMsg);
    });

    socket.on('disconnect', () => {
        const user = onlineUsers.get(socket.id);
        if (user) {
            onlineUsers.delete(socket.id);
            io.to(user.room).emit(
                'onlineUsers',
                Array.from(onlineUsers.values())
                    .filter(u => u.room === user.room)
                    .map(u => u.username)
            );


            const leaveMsg = { user: 'System', text: `${user.username} left the room.`, time: new Date() };
            rooms.get(user.room).push(leaveMsg);
            io.to(user.room).emit('chatMessage', leaveMsg);

            console.log(`${user.username} disconnected from room: ${user.room}`);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
