import React, { useState, useRef, useEffect } from 'react';
import { numCols, numRows } from './GridConstants.jsx';

export default function BaseGrid({ items, worldState }) {
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
}
