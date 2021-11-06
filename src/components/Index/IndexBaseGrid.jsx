/* eslint-disable react/prop-types */
import React from 'react';
// CUSTOM IMPORTS
import { indexNumCols } from '../World/utils.mjs';

export default function IndexBaseGrid({
  world,
}) {
  const { board } = world.worldState;
  const arr1d = [].concat(...board);
  // read arr2d for wall grid, set div style accordigng to color stored in array
  const cells = arr1d.map((cell, index) => (
    <div
      className="cell gridBorder"
      key={`base${Math.floor(index / indexNumCols)}_${index % indexNumCols}`}
      style={{
        backgroundColor: cell === null ? cell : cell.color,
      }}
    >
      {cell === null || ''}
    </div>
  ));
  return (
    <div
      id="indexBaseGrid"
      className="index-grid-container position-absolute position-absolute-index-grid"
    >
      {cells}
    </div>
  );
}
