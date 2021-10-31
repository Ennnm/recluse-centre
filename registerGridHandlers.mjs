import { genGridArray } from './src/components/World/GridConstants.mjs';

// link to db
// an array for each world
const playerGrids = [genGridArray()];
const playerPositions = [];

const gridFromPlayerPositions = (playerPostions) => {
  // new Grid
  const playerIdGrid = genGridArray();
  playerPositions.forEach((player) => {
    playerIdGrid[player.y][player.x] = player.userId;
  });
  return playerIdGrid;
};

export default function registerGridHandlers(io, socket) {
  // payload is the message

  const readGrid = (worldId, orderId, callback) => { // ...
  };

  const updateGrid = (userObj) => {
    const {
      worldId, userId, x, y,
    } = userObj;
    // find in list playerPositions, replace x and y
    const player = playerPositions.filter((user) => user.userId === userId);
    if (player.length > 0) {
      player[0].x = x;
      player[0].y = y;
    }
    else {
      playerPositions.push({ userId, x, y });
    }
    // server side compilation
    const playerIdGrid = gridFromPlayerPositions(playerPositions);
    playerGrids[worldId - 1] = playerIdGrid;
    // console.log('server side updateGrid :>> ', userObj);
    // playerGrid[worldId - 1][y][x] = userId;
    // io.emit('JOIN_REQUEST_ACCEPTED', userObj);
    io.emit('PLAYER_POSITIONS', playerIdGrid);
  };
  const disconnectUser = () => {
    // Remove users from all worlds
  };
  // when client logs into world, pings to server: entered world {roomId, userId, x,y}
  socket.on('grid:enter', updateGrid);

  // when client moves, send to specific room of server  {roomId, userId, x, y}
  // server finds client from the playerPostions array and rewrites X and Y
  // server compiles 2d array with 1 object per cell
  socket.on('grid:update', updateGrid);
  socket.on('grid:read', readGrid);

  socket.on('disconnect', disconnectUser);
}
