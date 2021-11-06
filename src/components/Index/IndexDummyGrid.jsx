/* eslint-disable react/prop-types */
import React from 'react';
// CUSTOM IMPORTS
import { indexNumCols, indexNumRows } from '../World/utils.mjs';

export default function IndexDummyGrid() {
  const arr1d = [];
  // read arr2d for wall grid, set div style accordigng to color stored in array
  const totalNumCells = indexNumRows * indexNumCols;

  for (let i = 0; i < totalNumCells; i += 1) {
    arr1d.push(
      <div className="cell gridBorder" key={`dummy${i.toString()}`} />,
    );
  }
  return (
    <div
      id="indexDummyGrid"
      className="index-grid-container invisible"
    >
      {arr1d}
    </div>
  );
}
