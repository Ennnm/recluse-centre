/* eslint-disable react/prop-types */
import React from 'react';
import { numCols } from './GridConstants.mjs';

export default function BaseGrid({
  world,
  showText = true,
  visibility = true,
}) {
  const { board } = world.worldState;
  const arr1d = [].concat(...board);
  // read arr2d for wall grid, set div style accordigng to color stored in array
  const cells = arr1d.map((cell, index) => (
    <div
      className="cell gridBorder"
      key={`base${Math.floor(index / numCols)}_${index % numCols}`}
      style={{
        backgroundColor: cell === null ? cell : cell.color,
      }}
    >
      {cell === null ||
        (!showText ? (
          ''
        ) : (
          <span className="cell-charfill">{cell.charFill}</span>
        ))}
    </div>
  ));
  return (
    <div
      id="baseGrid"
      className={`grid-container${
        visibility
          ? ' position-absolute position-absolute-stretch'
          : ' invisible pb-for-chat'
      }`}
    >
      {cells}
    </div>
  );
}
