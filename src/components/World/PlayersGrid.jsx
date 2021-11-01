import React, { useState, useEffect, useContext, useCallback } from 'react';
import _ from 'lodash';
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
    x: getRandomInt(numCols),
    y: getRandomInt(numRows),
  });
  const [playersPositions, setPlayersPositions] = useState(genGridArray());

  const socket = useContext(SocketContext);
  // set userId as context?
  const userId = getUserIdCookie();
  // link with pages/db
  const worldId = 1;
  console.log('running in playergrid');

  const handlePlayersPositions = useCallback((playerPos) => {
    const { x, y } = userPosition;
    playerPos[y][x] = userId;
    setPlayersPositions(playerPos);
  });

  const items = genGridArray();
  items[userPosition.y][userPosition.x] = userColor;
  useEffect(() => {
    // getting world data
    socket.emit('grid:join', { userId, worldId });
  }, [socket]);
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
    socket.emit('grid:update', {
      worldId,
      userId,
      x: userPosition.x,
      y: userPosition.y,
    });
    // subscribe to socket events

    socket.on('PLAYER_POSITIONS', handlePlayersPositions);

    return () => {
      // needs to be removed as if its retained, document will have multiple 'keypress' listeners
      // can't use an anonymous function, won't be able to track the exact function
      document.removeEventListener('keypress', handleKeyPress);
      socket.off('PLAYER_POSITIONS', handlePlayersPositions);
    };
  }, [socket, userPosition]);

  console.log('rendering player grid');
  const arr1d = [].concat(...playersPositions);
  const cells = arr1d.map((cell, index) => (
    <div
      className="cell"
      key={`player${Math.floor(index / numCols)}_${index % numCols}`}
      // style={{
      //   backgroundColor: cell,
      // }}
    >
      {cell !== null && (
        <img
          src={`https://avatars.dicebear.com/api/big-smile/${cell + 1}.svg`}
          alt="profile pic"
        />
      )}
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
