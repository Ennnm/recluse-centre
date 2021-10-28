import { genGridArray } from './src/components/World/GridConstants.mjs';

export default function registerGridHandlers(io, socket) {
  // payload is the message
  const playerGrid = genGridArray();
  const createOrder = (payload) => { // ...
  };
  const readOrder = (orderId, callback) => { // ...
  };

  const updateGrid = (userObj) => {
    const {
      roomId, userId, x, y,
    } = userObj;
  };

  // when client logs into world, pings to server: entered world {roomId, userId, x,y}
  socket.on('grid:enter', updateGrid);

  // when client moves, send to specific room of server  {roomId, userId, x, y}
  // server finds client from the playerPostions array and rewrites X and Y
  // server compiles 2d array with 1 object per cell
  socket.on('grid:update', updateGrid);
  socket.on('grid:read', readGrid);
}
