import React, { useState } from 'react';

const numCols = 30;
const numRows = 20;

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
const userColor = getRandomColor();

const genGridArray = () => {
  //TODO: fine tune sizing, size for tablet

  //nested arrays easier for checking adjacency vs using flat array
  const arr = [...Array(numRows)].map(() => Array(numCols).fill(''));
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
  const arr1d = [].concat(...arr2d);
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
        // style={{ backgroundColor: userColor }}
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
  playersArr2d[0][0] = userColor;
  console.log('playersArr2d[0][0] :>> ', playersArr2d[0][0]);
  const arr1d = [].concat(...playersArr2d);
  //read arr2d for wall grid, set div style accordigng to color stored in array
  const cells = arr1d.map((cell, index) => (
    <div
      className="cell"
      id={`player${Math.floor(index / numCols)}${index % numCols}`}
      style={{ backgroundColor: { cell } }}
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
      // style={{ backgroundColor: userColor }}
    ></div>
  ));
  return cells;
};

const addUser = (rowCoord, colCoord, arr) => {};
//INPLANT A USER DOT
//MOVE DOT IN GRID

export default function GridElem() {
  const clickCells = clickGrid(genGridArray());
  const playerCells = playersGrid(genGridArray());
  const baseCells = baseGrid(genGridArray());
  //fill in with row and cell elements
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
