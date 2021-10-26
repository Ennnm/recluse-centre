import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { numCols, numRows, genGridArray } from './GridConstants.jsx';
import BaseGrid from './BaseGrid.jsx';

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

export default function EditWorld() {
  // to read from db
  const [backgrndArr, setBackgrndArr] = useState(genGridArray());
  const [worldState, setWorldState] = useState({
    rooms: [],
    walls: [],
    actionObjects: [],
  });
  return (
    <div className="pt-5">
      <h1>⚒ Edit World</h1>
      <BaseGrid items={backgrndArr} worldState={worldState} />
      <BuildGrid items={backgrndArr} setItems={setBackgrndArr} />
    </div>
  );
}
