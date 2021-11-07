/* eslint-disable no-restricted-syntax */
import { genGridArray } from './src/components/World/utils.mjs';
// link to db, get number of player grids from there

function World(id) {
  this.id = id;
  this.playerGrid = genGridArray();
  this.playerPositions = [];
  this.playerSocketIds = [];
}
function SocketUser(userId, realName, username, description, socketId) {
  this.id = userId;
  this.realName = realName;
  this.username = username;
  this.description = description;

  this.socketId = socketId;
}

const worlds = [new World(1)];
const WORLDHEADER = 'world_';
const gridFromPlayerPositions = (playerPositions) => {
  const playerIdGrid = genGridArray();
  playerPositions.forEach((player) => {
    playerIdGrid[player.y][player.x] = player;
  });
  return playerIdGrid;
};

export default function registerGridHandlers(io, socket) {
  // payload is the message
  const joinGrid = async ({
    userId, realName, username, description, worldId, userPosition,
  }) => {
    console.log('JoinuserId :>> ', userId);
    console.log('worldId :>> ', worldId);

    // const user = await getUserFromId(userId); //can't do axios from server side?
    // console.log('user in join grid :>> ', user);
    const worldFromId = worlds.filter((world) => (world.id === worldId))[0];
    const { playerGrid, playerSocketIds } = worldFromId;

    console.log('userPosition :>> ', userPosition);
    playerGrid[userPosition.y][userPosition.x] = {
      id: userId, realName, username, description,
    };

    playerSocketIds.push(new SocketUser(userId, realName, username, description, socket.id));

    socket.join(`${WORLDHEADER}${worldId}`);
    io.to(`${WORLDHEADER}${worldId}`).emit('PLAYER_POSITIONS', playerGrid);
  };

  const updateWorld = ({ worldId }) => {
    console.log('request to update world', worldId);
    io.to(`${WORLDHEADER}${worldId}`).emit('UPDATE_BASEGRID');
    // io.sockets.in(`${WORLDHEADER}${worldId}`).emit('UPDATE_BASEGRID');
  };

  const updateGrid = (userObj) => {
    const {
      worldId, user, x, y,
    } = userObj;
    console.log('request to update player grid');
    const worldFromId = worlds.filter((world) => (world.id === worldId))[0];
    const { playerPositions } = worldFromId;
    let { playerGrid } = worldFromId;

    // find in list playerPositions, replace x and y
    const player = playerPositions.filter((p) => p.id === user.id);
    if (player.length > 0) {
      player[0].x = x;
      player[0].y = y;
      player[0].realName = user.realName;
      player[0].username = user.username;
    }
    else {
      console.log('user :>> ', user);
      playerPositions.push({
        id: user.id,
        realName: user.realName,
        username: user.username,
        description: user.description,
        x,
        y,
      });
    }
    // server side compilation
    const playerIdGrid = gridFromPlayerPositions(playerPositions);
    playerGrid = playerIdGrid;
    io.to(`${WORLDHEADER}${worldId}`).emit('PLAYER_POSITIONS', playerGrid);
  };

  const disconnectingUser = () => {
    let room = '';
    let roomId;
    // find room name from set
    console.log('socket.rooms :>> ', socket.rooms);
    for (let refRoom of socket.rooms) {
      console.log('refRoom :>> ', refRoom);
      refRoom = refRoom.toString();
      if (refRoom.substr(0, WORLDHEADER.length) === WORLDHEADER) {
        room = refRoom;
        break;
      }
    }
    if (room !== '') {
      roomId = Number(room.substring(WORLDHEADER.length));
      const world = worlds.filter((world) => (world.id === roomId))[0];
      const socketPlayer = world.playerSocketIds.filter((user) => (user.socketId === socket.id))[0];
      if (socketPlayer !== undefined)
      {
        const playerId = socketPlayer.id;

        world.playerPositions = world.playerPositions.filter((player) => (player.id !== playerId));
        world.playerSocketIds = world.playerSocketIds.filter((player) => (player.id !== playerId));
        world.playerGrid = gridFromPlayerPositions(world.playerPositions);

        io.sockets.in(`${WORLDHEADER}${roomId}`).emit('PLAYER_POSITIONS', world.playerGrid);
      }
    }
  };
  // when client logs into world, pings to server: entered world {roomId, userId, x,y}
  socket.on('grid:enter', updateGrid);
  socket.on('grid:update:world', updateWorld);
  socket.on('grid:update', updateGrid);
  socket.on('grid:join', joinGrid);

  socket.on('disconnecting', disconnectingUser);
}
