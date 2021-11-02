/*
  eslint-disable jsx-a11y/no-static-element-interactions,
  no-confusing-arrow, jsx-a11y/control-has-associated-label, react/prop-types
*/
import React, { useState, useRef, useEffect } from 'react';
import {
  numCols, numRows, genGridArray, ActiveObj,
} from './GridConstants.mjs';

import { getRandomInt } from '../../../utils.mjs';

const clickOnCell = (obj) => {
  console.log('cell clicked', obj);
  window.open(obj.url);
};
const iconFromObjType = (obj) => {
  let img = '';
  switch (obj.type) {
    case 'zoom':
      img = 'zoom.png';
      break;
    case 'note':
      img = 'sticky_notes.png';
      break;
    case 'lucid':
      img = 'lucid.png';
      break;
    case 'figma':
      img = 'figma.png';
    default:
      break;
  }

  return img;
};

// click grid for special objects
export default function ClickGrid({ items }) {
  const initGrid = genGridArray();
  items.forEach((item) => {
    initGrid[item.y][item.x] = item;
  });

  const arr1d = [].concat(...initGrid);
  // on click, if square is empty, fill with new color
  // if not remove color

  const cells = arr1d.map((cell, index) => cell !== null ? (
    <input
      type="image"
      src={iconFromObjType(cell)}
      onClick={() => {
        clickOnCell(cell);
      }}
      className="cell"
      key={`cg${Math.floor(index / numCols)}_${index % numCols}`}
      alt={cell.type}
    />
  ) : (
    <div
      className="cell"
      key={`cg${Math.floor(index / numCols)}_${index % numCols}`}
      style={{ pointerEvents: 'none' }}
    />
  ));

  return (
    <div
      id="clickGrid"
      style={{ zIndex: 3 }}
      className="grid-container"
    >
      {cells}
    </div>
  );
}
