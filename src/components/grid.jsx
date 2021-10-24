import React, { useState } from 'react';

const numCols = 30;
const numRows = 20;
const playerPosition = [getRandomInt(numCols), getRandomInt(numRows)]; //X,Y

console.log('playerPosition :>> ', playerPosition);
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
const userColor = getRandomColor();

const genGridArray = (fill = null) => {
  //TODO: fine tune sizing, size for tablet
  //nested arrays easier for checking adjacency vs using flat array
  const arr = [...Array(numRows)].map(() => Array(numCols).fill(fill));
  return arr;
};
const clickOnCell = (index) => {
  console.log(`cell ${index} clicked`);
};
//flat list of divs <-
// or rows of divs
const gridCells = (arr2d) => {
  const arr1d = [].concat(...arr2d);
  const cells = arr1d.map((cell, index) => (
    <button
      onClick={() => {
        clickOnCell(`row${Math.floor(index / numCols)}_col${index % numCols}`);
      }}
      className="cell"
      id={`row${Math.floor(index / numCols)}_col${index % numCols}`}
      // style={{ backgroundColor: userColor }}
    ></button>
  ));

  return cells;
};

//click grid for special objects
const clickGrid = (arr2d) => {
  console.log('arr2d :>> ', arr2d);
  const arr1d = [].concat(...arr2d);
  console.log('arr1d :>> ', arr1d);
  const cells = arr1d.map((cell, index) =>
    cell !== null ? (
      <button
        onClick={() => {
          clickOnCell(
            `row${Math.floor(index / numCols)}_col${index % numCols}`
          );
        }}
        className="cell"
        id={`row${Math.floor(index / numCols)}_col${index % numCols}`}
      ></button>
    ) : (
      <div
        className="cell"
        id={`row${Math.floor(index / numCols)}_col${index % numCols}`}
      ></div>
    )
  );

  return cells;
};

//players grid
const playersGrid = (playersArr2d) => {
  //implant player in
  playersArr2d[playerPosition[1]][playerPosition[0]] = userColor;
  // playersArr2d[0][0] = userColor;
  const arr1d = [].concat(...playersArr2d);
  //read arr2d for wall grid, set div style accordigng to color stored in array
  const cells = arr1d.map((cell, index) => (
    <div
      className="cell"
      id={`player${Math.floor(index / numCols)}${index % numCols}`}
      style={{ backgroundColor: cell }}
    ></div>
  ));
  return cells;
};
//ground, walls
const baseGrid = (arr2d) => {
  const arr1d = [].concat(...arr2d);
  //read arr2d for wall grid, set div style accordigng to color stored in array
  const cells = arr1d.map((cell, index) => (
    <div
      className="cell"
      id={`base${Math.floor(index / numCols)}${index % numCols}`}
      style={{ backgroundColor: cell }}
    ></div>
  ));
  return cells;
};

const addUser = (rowCoord, colCoord, arr) => {};
//INPLANT A USER DOT
//MOVE DOT IN GRID

export default function GridElem() {
  const [userPosition, setUserPosition] = useState([
    getRandomInt(numCols),
    getRandomInt(numRows),
  ]);
  const clickCells = clickGrid(genGridArray());
  const playerCells = playersGrid(genGridArray());
  const baseCells = baseGrid(genGridArray('rgb(255, 255, 255)'));
  //fill in with row and cell elements

  const movePlayer = (x, y) => {
    let destinationX = userPosition[0];
    let destinationY = userPosition[1];
    console.log('destinationX :>> ', destinationX);
    console.log('destinationY :>> ', destinationY);
    if (destinationX + x >= 0 && destinationX + x < numCols) {
      destinationX += x;
    }
    if (destinationY + y >= 0 && destinationY + y < numRows) {
      destinationY += y;
    }
    console.log('destinationX :>> ', destinationX);
    console.log('destinationY :>> ', destinationY);
    setUserPosition([destinationX, destinationY]);

    //TODO FIGURE HOW TO GET THIS TO WORK
  };

  const handleKeyDown = (e) => {
    console.log('e.code :>> ', e.code);
    console.log('userPosition :>> ', userPosition);
    switch (e.code) {
      case 'keyA':
        movePlayer(-1, 0);
        break;
      case 'keyW':
        movePlayer(0, 1);
        break;
      case 'keyD':
        movePlayer(1, 0);
        break;
      case 'keyS':
        movePlayer(0, -1);

        break;
    }
    console.log('userPosition2 :>> ', userPosition);
  };
  document.addEventListener('keydown', handleKeyDown);

  return (
    <div position-relative>
      <div id="baseGrid" className="grid-container position-absolute">
        {baseCells}
      </div>
      <div
        id="playerGrid"
        style={{ zIndex: 1 }}
        className="grid-container position-absolute"
      >
        {playerCells}
      </div>
      <div
        id="clickGrid"
        style={{ zIndex: 2 }}
        className="grid-container position-absolute"
      >
        {clickCells}
      </div>
    </div>
  );
}
