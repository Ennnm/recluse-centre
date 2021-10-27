import React, { useState, useEffect } from 'react';
import { numCols, numRows, genGridArray } from './GridConstants.mjs';

import { getRandomColor, getRandomInt } from '../../../utils.mjs';

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
  console.log('keydown');
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
export default function PlayersGrid({ playerPositions, backgrndArr }) {
  // to replace with last position from db
  const [userPosition, setUserPosition] = useState({
    // x: 11,
    // y: 11,
    x: getRandomInt(numCols),
    y: getRandomInt(numRows),
  });
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

        // should send this new position to other users via sockets
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
  // read arr2d for wall grid, set div style accordigng to color stored in array
  const cells = arr1d.map((cell, index) => (
    <div
      className="cell"
      key={`player${Math.floor(index / numCols)}_${index % numCols}`}
      style={{
        backgroundColor: cell,
        // borderRadius: '45%',
      }}
    />
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
