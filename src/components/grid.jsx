/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-confusing-arrow */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useRef, useEffect } from 'react';

const numCols = 30;
const numRows = 20;
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
const userColor = getRandomColor();

const genGridArray = (fill = null) => {
  // TODO: fine tune sizing, size for tablet
  // nested arrays easier for checking adjacency vs using flat array
  const arr = [...Array(numRows)].map(() => Array(numCols).fill(fill));
  return arr;
};
const clickOnCell = (index) => {
  console.log(`cell ${index} clicked`);
};

// click grid for special objects
const ClickGrid = ({ items }) => {
  console.log('rendering click grid');
  const arr1d = [].concat(...items);
  // on click, if square is empty, fill with new color
  // if not remove color

  const cells = arr1d.map((cell, index) =>
    cell !== null ? (
      <button
        type="submit"
        onClick={() => {
          clickOnCell(`cg${Math.floor(index / numCols)}_${index % numCols}`);
        }}
        className="cell"
        key={`cg${Math.floor(index / numCols)}_${index % numCols}`}
      />
    ) : (
      <div
        className="cell"
        key={`cg${Math.floor(index / numCols)}_${index % numCols}`}
      />
    )
  );

  return (
    <div
      id="clickGrid"
      style={{ zIndex: 3 }}
      className="grid-container position-absolute"
    >
      {cells}
    </div>
  );
};

const getRow = (index) => Math.floor(index / numCols);
const getCol = (index) => index % numCols;
const colorPalette = ['#A09ABC', '#21A179', '#0B4F6C', '#FFC09F', '#FF5A5F'];
const buildOnCell = (row, col, worldArr, setWorldArr) => {
  const color = colorPalette[0];
  if (worldArr[row][col] === null) {
    worldArr[row][col] = color;
  } else {
    worldArr[row][col] = null;
  }
  setWorldArr([...worldArr]);
  console.log('worldArr :>> ', worldArr);
  console.log(`building on cell ${row}_${col}`);
};
const BuildGrid = ({ items, setItems }) => {
  console.log('rendering click grid');
  const arr1d = [].concat(...items);
  // on click, if square is empty, fill with new color
  // if not remove color

  const cells = arr1d.map((cell, index) => (
    <input
      type="text"
      onMouseDown={() => {
        buildOnCell(getRow(index), getCol(index), items, setItems);
      }}
      className="cell"
      key={`bg${getRow(index)}_${getCol(index)}`}
    />
  ));

  return (
    <div
      id="BuildGrid"
      style={{ zIndex: 4, cursor: 'grab' }}
      className="grid-container position-absolute"
    >
      {cells}
    </div>
  );
};

const movePlayer = (userPosition, x, y) => {
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
// players grid
const PlayersGrid = () => {
  const [userPosition, setUserPosition] = useState({
    x: getRandomInt(numCols),
    y: getRandomInt(numRows),
  });
  const items = genGridArray();
  items[userPosition.y][userPosition.x] = userColor;

  useEffect(() => {
    const handleKeyPress = (e) => {
      const [displacementX, displacementY] = getDisplacementFromKey(e.code);
      if (!((displacementX === displacementY) === 0)) {
        const [x, y] = movePlayer(userPosition, displacementX, displacementY);
        setUserPosition({ x, y });
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
      style={{ backgroundColor: cell }}
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
};

// ground, walls

const BaseGrid = ({ items }) => {
  console.log('rendering base grid');
  const arr1d = [].concat(...items);
  // read arr2d for wall grid, set div style accordigng to color stored in array
  const cells = arr1d.map((cell, index) => (
    <div
      className="cell"
      key={`base${Math.floor(index / numCols)}_${index % numCols}`}
      style={{ backgroundColor: cell, fontSize: '9px' }}
    >
      {Math.floor(index / numCols)}_{index % numCols}
    </div>
  ));
  return (
    <div id="baseGrid" className="grid-container position-absolute">
      {cells}
    </div>
  );
};

const addUser = (rowCoord, colCoord, arr) => {};
// INPLANT A USER DOT
// MOVE DOT IN GRID

export default function GridElem() {
  // to read from db
  const [backgrndArr, setBackgrndArr] = useState(genGridArray());
  const [playerPos, setPlayerPos] = useState(genGridArray());
  const [clickableCells, setClickCells] = useState(genGridArray());
  console.log('rendering grid elem');
  console.log('playerPos :>> ', playerPos);

  return (
    <div>
      <BaseGrid items={backgrndArr} />
      <PlayersGrid items={playerPos} />
      <ClickGrid items={clickableCells} />
      <BuildGrid items={backgrndArr} setItems={setBackgrndArr} />
    </div>
  );
}
