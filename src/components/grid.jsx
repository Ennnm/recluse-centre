import React, { useState } from 'react';

const columns = 30;
const rows = 20;

const genGridArray = () => {
  //TODO: fine tune sizing, size for tablet

  //nested arrays easier for checking adjacency vs using flat array
  const arr = [...Array(rows)].map(() => Array(columns).fill(''));
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
        clickOnCell(`row${Math.floor(index / columns)}_col${index % columns}`);
      }}
      className="cell"
      id={`row${Math.floor(index / columns)}_col${index % columns}`}
    ></button>
  ));

  return cells;
};

export default function GridElem() {
  const cells = gridCells(genGridArray());
  //fill in with row and cell elements
  return (
    <div id="grid" className="grid-container">
      {cells}
    </div>
  );
}
