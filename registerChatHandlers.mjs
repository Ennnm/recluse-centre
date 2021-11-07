export default function registerChatHandlers(io, socket) {
  socket.on('chat:send', (data) => {
    console.log('Message sent!');
    console.log(data);
    socket.to(data.room).emit('chat:receive', data);
  });
}
