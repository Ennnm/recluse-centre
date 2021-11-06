/* eslint-disable react/prop-types */
import React from 'react';

export default function IndexBaseGrid({
  world,
}) {
  const indexNumCols = 34;
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
      className="index-grid-container position-absolute position-absolute-stretch"
    >
      {cells}
    </div>
  );
}
