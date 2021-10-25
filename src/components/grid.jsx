/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-confusing-arrow */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';

const numCols = 30;
const numRows = 20;
const playerPosition = [getRandomInt(numCols), getRandomInt(numRows)]; // X,Y

console.log('playerPosition :>> ', playerPosition);
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
  console.log('arr2d :>> ', items);
  const arr1d = [].concat(...items);
  console.log('arr1d :>> ', arr1d);
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

// players grid
const PlayersGrid = ({ items, handleKeyDown }) => {
  // implant player in
  console.log('playerPositions :>> ', items);
  items[playerPosition[1]][playerPosition[0]] = userColor;
  // playersArr2d[0][0] = userColor;
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
      onKeyDown={handleKeyDown}
      id="playerGrid"
      style={{ zIndex: 1 }}
      className="grid-container position-absolute"
    >
      {cells}
    </div>
  );
};
// ground, walls
const BaseGrid = ({ items }) => {
  const arr1d = [].concat(...items);
  // read arr2d for wall grid, set div style accordigng to color stored in array
  const cells = arr1d.map((cell, index) => (
    <div
      className="cell"
      key={`base${Math.floor(index / numCols)}_${index % numCols}`}
      style={{ backgroundColor: cell }}
    />
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
  const [userPosition, setUserPosition] = useState([
    getRandomInt(numCols),
    getRandomInt(numRows),
  ]);

  // to read from db
  const [backgrndArr, setBackgrndArr] = useState(
    genGridArray('rgb(255, 255, 255)')
  );
  const [playerPos, setPlayerPos] = useState(genGridArray());
  const [clickableCells, setClickCells] = useState(genGridArray());
  console.log('playerPos :>> ', playerPos);
  // bring in as props
  // const clickCells = ClickGrid(genGridArray());
  // const playerCells = PlayersGrid(genGridArray());
  // fill in with row and cell elements

  const movePlayer = (x, y) => {
    let destinationX = userPosition[0];
    let destinationY = userPosition[1];
    if (destinationX + x >= 0 && destinationX + x < numCols) {
      destinationX += x;
    }
    if (destinationY + y >= 0 && destinationY + y < numRows) {
      destinationY += y;
    }
    setUserPosition([destinationX, destinationY]);

    // TODO FIGURE HOW TO GET THIS TO WORK
  };

  const handleKeyDown = (e) => {
    console.log('e.code :>> ', e.code);
    console.log('userPosition :>> ', userPosition);
    switch (e.code) {
      case 'KeyA':
        movePlayer(-1, 0);
        break;
      case 'KeyW':
        movePlayer(0, 1);
        break;
      case 'KeyD':
        movePlayer(1, 0);
        break;
      case 'KeyS':
        movePlayer(0, -1);
        break;
      default:
        break;
    }
    console.log('userPosition2 :>> ', userPosition);
  };
  document.addEventListener('keydown', handleKeyDown);

  return (
    <div>
      <BaseGrid items={backgrndArr} />
      <PlayersGrid items={playerPos} handleKeyDown={handleKeyDown} />
      <ClickGrid items={clickableCells} />
    </div>
  );
}
