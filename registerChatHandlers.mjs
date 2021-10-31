export default function registerChatHandlers(io, socket) {
  socket.on('chat:join', (data) => {
    socket.join(data);
    console.log(`User with socket ID ${socket.id} joined room: ${data}`);
  });
}
