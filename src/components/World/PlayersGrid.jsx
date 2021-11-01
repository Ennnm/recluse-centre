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

  if (destinationX + x >= 0 && destinationX + x < numCols) {
    destinationX += x;
  }
  if (destinationY + y >= 0 && destinationY + y < numRows) {
    destinationY += y;
  }
  return [destinationX, destinationY];
};
const directionalKeyPresses = ['KeyA', 'KeyW', 'KeyD', 'KeyS'];

const directions = {
  top: [0, -1],
  bottom: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

const getDisplacementFromKey = (code) => {
  let direction = [];
  switch (code) {
    case 'KeyA':
      direction = directions.left;
      break;
    case 'KeyW':
      direction = directions.top;
      break;
    case 'KeyD':
      direction = directions.right;
      break;
    case 'KeyS':
      direction = directions.bottom;
      break;
    default:
      direction = [0, 0];
      break;
  }
  let XY = [0, 0];
  XY = XY.map((coord, i) => coord + direction[i]);
  return XY;
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
const getActiveAdjCells = (userPosition, activeCells) => {
  const directionValues = Object.values(directions);
  const adjCells = directionValues.map((dir) =>
    movedPosition(userPosition, dir[0], dir[1])
  );
  const activeAdjCells = [];
  for (let i = 0; i < activeCells.length; i += 1) {
    const activeCell = activeCells[i];

    for (let j = 0; j < adjCells.length; j += 1) {
      const adjCell = adjCells[j];
      console.log('adjCell :>> ', adjCell);
      if (activeCell.x === adjCell[0] && activeCell.y === adjCell[1]) {
        activeAdjCells.push(activeCell);
      }
    }
  }
  return activeAdjCells;
};
export default function PlayersGrid({ backgrndArr, activeCells }) {
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
      if (directionalKeyPresses.includes(e.code)) {
        const [displacementX, displacementY] = getDisplacementFromKey(e.code);

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
      } else if (e.code === 'KeyE') {
        const activeAdjCells = getActiveAdjCells(userPosition, activeCells);
        console.log('activeAdjCells :>> ', activeAdjCells);

        activeAdjCells.forEach((cell) => {
          window.open(cell.url);
        });
      }
    };
    document.addEventListener('keypress', handleKeyPress);
    socket.emit('grid:update', {
      worldId,
      userId,
      x: userPosition.x,
      y: userPosition.y,
    });

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
