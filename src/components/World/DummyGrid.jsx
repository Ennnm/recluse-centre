/* eslint-disable react/prop-types */
import React from 'react';
import { numRows, numCols } from './utils.mjs';

export default function DummyGrid({}) {
  const arr1d = [];
  // read arr2d for wall grid, set div style accordigng to color stored in array
  const totalNumCells = numRows * numCols;

  for (let i = 0; i < totalNumCells; i += 1) {
    arr1d.push(
      <div className="cell gridBorder" key={`dummy${i.toString()}`} />
    );
  }
  return (
    <div
      id="baseGrid"
      className={`grid-container invisible pb-for-chat
      `}
    >
      {arr1d}
    </div>
  );
}
