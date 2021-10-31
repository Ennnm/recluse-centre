export default function registerChatHandlers(io, socket) {
  socket.on('chat:join', (data) => {
    socket.join(data);
    console.log(`User with socket ID ${socket.id} joined room: ${data}`);
  });

  socket.on('chat:send', (data) => {
    console.log('Message sent!');
    console.log(data);
    socket.to(data.room).emit('chat:receive', data);
  });
}
