/* eslint-disable no-restricted-syntax */
import { genGridArray } from './src/components/World/GridConstants.mjs';

// link to db, get number of player grids from there
// an array for each world

function World(id) {
  this.id = id;
  this.playerGrid = genGridArray();
  this.playerPositions = [];
  this.playerSocketIds = [];
}
function SocketUser(userId, socketId) {
  this.id = userId,
  this.socketId = socketId;
}

const worlds = [new World(1)];
const WOLRDHEADER = 'world_';
const gridFromPlayerPositions = (playerPositions) => {
  const playerIdGrid = genGridArray();
  playerPositions.forEach((player) => {
    playerIdGrid[player.y][player.x] = player.userId;
  });
  return playerIdGrid;
};

export default function registerGridHandlers(io, socket) {
  // payload is the message
  const joinGrid = ({ userId, worldId }) => {
    console.log('userId :>> ', userId);
    console.log('worldId :>> ', worldId);
    const worldFromId = worlds.filter((world) => (world.id === worldId))[0];
    const { playerGrid, playerSocketIds } = worldFromId;

    playerSocketIds.push(new SocketUser(userId, socket.id));
    socket.join(`${WOLRDHEADER}${worldId}`);
    io.sockets.in(`${WOLRDHEADER}${worldId}`).emit('PLAYER_POSITIONS', playerGrid);
  };

  const updateGrid = (userObj) => {
    const {
      worldId, userId, x, y,
    } = userObj;

    const worldFromId = worlds.filter((world) => (world.id === worldId))[0];
    const { playerPositions } = worldFromId;
    let { playerGrid } = worldFromId;

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
    playerGrid = playerIdGrid;
    io.sockets.in(`${WOLRDHEADER}${worldId}`).emit('PLAYER_POSITIONS', playerGrid);
  };

  const disconnectingUser = () => {
    let room = '';
    let roomId;
    // find room name from set
    for (const refRoom of socket.rooms) {
      if (refRoom.substr(0, WOLRDHEADER.length) === WOLRDHEADER) {
        room = refRoom;
        break;
      }
    }
    if (room !== '') {
      roomId = Number(room.substring(WOLRDHEADER.length));
      const world = worlds.filter((world) => (world.id === roomId))[0];
      const playerId = world.playerSocketIds.filter((user) => (user.socketId === socket.id))[0].id;
      world.playerPositions = world.playerPositions.filter((player) => (player.userId !== playerId));
      world.playerSocketIds = world.playerSocketIds.filter((player) => (player.id !== playerId));
      io.sockets.in(`${WOLRDHEADER}${roomId}`).emit('PLAYER_POSITIONS', world.playerGrid);
    }
  };
  // when client logs into world, pings to server: entered world {roomId, userId, x,y}
  socket.on('grid:enter', updateGrid);

  socket.on('grid:update', updateGrid);
  socket.on('grid:join', joinGrid);

  socket.on('disconnecting', disconnectingUser);
}
