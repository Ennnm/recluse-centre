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
// flat list of divs <-
// or rows of divs
const GridCells = (arr2d) => {
  const arr1d = [].concat(...arr2d);
  const cells = arr1d.map((cell, index) => (
    <button
      type="button"
      onClick={() => {
        clickOnCell(`grid${Math.floor(index / numCols)}_${index % numCols}`);
      }}
      className="cell"
      key={`grid${Math.floor(index / numCols)}_${index % numCols}`}
    />
  ));

  return cells;
};

// click grid for special objects
const ClickGrid = ({ items }) => {
  console.log('rendering click grid');
  const arr1d = [].concat(...items);
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
      style={{ zIndex: 2 }}
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

// players grid
const PlayersGrid = ({ items }) => {
  const [userPosition, setUserPosition] = useState({
    x: getRandomInt(numCols),
    y: getRandomInt(numRows),
  });
  const prevPosition = useRef(userPosition);
  useEffect(() => {
    const handleKeyPress = (e) => {
      let displacementX = 0;
      let displacementY = 0;
      console.log('keydown');
      switch (e.code) {
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
      prevPosition.current = userPosition;
      const [x, y] = movePlayer(userPosition, displacementX, displacementY);
      if (prevPosition.current.x !== x || prevPosition.current.y !== y) {
        setUserPosition({ x, y }); // causing multiple rerenders
      }
    };
    document.addEventListener('keypress', handleKeyPress);
    return () => {
      // needs to be removed as if its retained, document will have multiple 'keypress' listeners
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [userPosition]);

  // implant player in
  console.log('rendering player grid');
  if (prevPosition !== null || prevPosition !== undefined) {
    items[prevPosition.current.y][prevPosition.current.x] = null;
  }
  items[userPosition.y][userPosition.x] = userColor;
  // playersArr2d[0][0] = userColor;
  const arr1d = [].concat(...items);
  // read arr2d for wall grid, set div style accordigng to color stored in array
  const cells = arr1d.map((cell, index) => (
    <div
      className="cell"
      key={`player${Math.floor(index / numCols)}_${index % numCols}`}
      style={{ backgroundColor: cell }}
    >
      {Math.floor(index / numCols)}_{index % numCols}
    </div>
  ));
  return (
    <div
      id="playerGrid"
      style={{ zIndex: 1, fontSize: '9px' }}
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
  // const [prevPosition, setPrevPosition] = useState(userPosition);

  // useEffect(() => {
  //   prevPosition.current = userPosition;
  // }, [userPosition]);

  // to read from db
  const [backgrndArr, setBackgrndArr] = useState(
    genGridArray('rgb(255, 255, 255)')
  );
  const [playerPos, setPlayerPos] = useState(genGridArray());
  const [clickableCells, setClickCells] = useState(genGridArray());
  console.log('rendering grid elem');
  console.log('playerPos :>> ', playerPos);

  return (
    <div>
      <BaseGrid items={backgrndArr} />
      <PlayersGrid items={playerPos} />
      <ClickGrid items={clickableCells} />
    </div>
  );
}
