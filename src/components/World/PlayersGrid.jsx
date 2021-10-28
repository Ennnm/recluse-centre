import React, { useState, useEffect, useContext } from 'react';
import { numCols, numRows, genGridArray } from './GridConstants.mjs';
import { SocketContext } from '../../contexts/sockets.mjs';

import {
  getRandomColor,
  getRandomInt,
  getUserIdCookie,
} from '../../../utils.mjs';

// should this be more global at the app level and passed down as a prop

const userColor = getRandomColor();

const movedPosition = (userPosition, x, y) => {
  let destinationX = userPosition.x;
  let destinationY = userPosition.y;

  // check if blocked by wall
  if (destinationX + x >= 0 && destinationX + x < numCols) {
    destinationX += x;
  }
  if (destinationY + y >= 0 && destinationY + y < numRows) {
    destinationY += y;
  }
  return [destinationX, destinationY];
};

const getDisplacementFromKey = (code) => {
  let displacementX = 0;
  let displacementY = 0;
  switch (code) {
    case 'KeyA':
      displacementX = -1;
      break;
    case 'KeyW':
      displacementY = -1;
      break;
    case 'KeyD':
      displacementX = 1;
      break;
    case 'KeyS':
      displacementY = 1;
      break;
    default:
      break;
  }
  return [displacementX, displacementY];
};
const getGridObject = (x, y, grid) => grid[y][x];
const isWall = (obj) => {
  if (obj !== null && obj.color !== '') {
    return true;
  }
  return false;
};
const movePlayer = (x, y, oldX, oldY, backgrndArr, setUserPosition) => {
  const gridObj = getGridObject(x, y, backgrndArr);
  // check if player is hitting any walls

  if (!isWall(gridObj)) {
    setUserPosition({ x, y });
  } else {
    // if user is in the wall
    const currentGrid = getGridObject(oldX, oldY, backgrndArr);
    if (isWall(currentGrid)) {
      setUserPosition({ x, y });
    }
  }
};

export default function PlayersGrid({ backgrndArr }) {
  // to replace with last position from db
  const [userPosition, setUserPosition] = useState({
    // x: 11,
    // y: 11,
    x: getRandomInt(numCols),
    y: getRandomInt(numRows),
  });
  const socket = useContext(SocketContext);
  // set userId as context?
  const userId = getUserIdCookie();

  useEffect(() => {
    console.log('socket in playerGrid :>> ', socket);
    socket.emit('grid:update', {
      roomId: 1,
      userId,
      x: userPosition.x,
      y: userPosition.y,
    });
    socket.emit('startpage');
    // subscribe to socket events
    socket.on('JOIN_REQUEST_ACCEPTED', (obj) => {
      console.log('join accepted', obj);
    });
    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      socket.off('JOIN_REQUEST_ACCEPTED', () => {
        console.log('unjoined');
      });
    };
  }, [socket, userPosition]);

  // socket.on('connect', () => {
  //   console.log('hey! receiving from playerGrid');
  // });

  // get existing state of the world, snap shot from sessions?
  // right now user only there if user move
  // unless user sends position every 5s? a persistent world state

  // multiple servers for multiple worlds

  // when client logs into world, pings to server: entered world {roomId, userId, x,y}
  // server adds client position to playerPostions array [user1, user2...]

  // when client moves, send to specific room of server  {roomId, userId, x, y}
  // server finds client from the playerPostions array and rewrites X and Y
  // server compiles 2d array with 1 object per cell

  // server sends out compiled positions to all sockets in the same room, updates db?
  // add column to worlds? so that it can also be assessed to be sent, may not be needed

  // client listens and received positions
  // superimpose own position on top, renders it

  // when client disconnects, emits message to server to remove player from
  // playerPositions array

  // when client changes world, emit message to all other world not the changed world to remove
  // player from playerPositions Array

  // keeping constant state of room at all time ensure everyone gets the same set of information

  const [playerPositions, setPlayerPos] = useState(genGridArray());

  // TODO: put playerGrids into items, not necessary to take in playerPositions from Grid
  const items = genGridArray();
  items[userPosition.y][userPosition.x] = userColor;

  useEffect(() => {
    const handleKeyPress = (e) => {
      const [displacementX, displacementY] = getDisplacementFromKey(e.code);
      if (!((displacementX === displacementY) === 0)) {
        const [x, y] = movedPosition(
          userPosition,
          displacementX,
          displacementY
        );
        movePlayer(
          x,
          y,
          userPosition.x,
          userPosition.y,
          backgrndArr,
          setUserPosition
        );
        // moving player would cause a reset of userPosition which is [x,y]
        // TODO: should send this new position to other users via sockets
      }
    };
    document.addEventListener('keypress', handleKeyPress);
    return () => {
      // needs to be removed as if its retained, document will have multiple 'keypress' listeners
      // can't use an anonymous function, won't be able to track the exact function
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [userPosition]);

  console.log('rendering player grid');
  const arr1d = [].concat(...items);
  // TODO: get userId from cookies, how to get cookies of site from react component
  const profilePic = `https://avatars.dicebear.com/api/personas/${userId}.svg`;
  const cells = arr1d.map((cell, index) => (
    <div
      className="cell"
      key={`player${Math.floor(index / numCols)}_${index % numCols}`}
      // style={{
      //   backgroundColor: cell,
      // }}
    >
      {cell && <img src={profilePic} alt="profile pic" />}
    </div>
  ));
  return (
    <div
      id="playerGrid"
      style={{ zIndex: 2 }}
      className="grid-container position-absolute"
    >
      {cells}
    </div>
  );
}
