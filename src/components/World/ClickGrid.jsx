/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-confusing-arrow */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useRef, useEffect } from 'react';
import { numCols, numRows, genGridArray } from './GridConstants.mjs';

const clickOnCell = (index) => {
  console.log(`cell ${index} clicked`);
};

// click grid for special objects
export default function ClickGrid({ items }) {
  const arr1d = [].concat(...items);
  // on click, if square is empty, fill with new color
  // if not remove color

  const cells = arr1d.map((cell, index) =>
    cell !== null ? (
      <button
        type="submit"
        onClick={() => {
          clickOnCell(`cg${Math.floor(index / numCols)}_${index % numCols}`);
        }}
        className="cell"
        style={{ border: '0px' }}
        key={`cg${Math.floor(index / numCols)}_${index % numCols}`}
      />
    ) : (
      <div
        className="cell"
        style={{ border: '0px' }}
        key={`cg${Math.floor(index / numCols)}_${index % numCols}`}
      />
    )
  );

  return (
    <div
      id="clickGrid"
      style={{ zIndex: 3 }}
      className="grid-container position-absolute"
    >
      {cells}
    </div>
  );
}
