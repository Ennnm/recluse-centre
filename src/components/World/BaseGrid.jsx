import React from 'react';
import { numCols } from './GridConstants.mjs';

export default function BaseGrid({ items, showText = true }) {
  const arr1d = [].concat(...items);
  // read arr2d for wall grid, set div style accordigng to color stored in array
  const cells = arr1d.map((cell, index) => (
    <div
      className="cell gridBorder"
      key={`base${Math.floor(index / numCols)}_${index % numCols}`}
      style={{
        backgroundColor: cell === null ? cell : cell.color,
      }}
    >
      {cell === null || !showText ? '' : cell.charFill}
    </div>
  ));
  return (
    <div id="baseGrid" className="grid-container position-absolute ">
      {cells}
    </div>
  );
}
