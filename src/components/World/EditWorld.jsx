import React, { useEffect, useState, useRef } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  Wall,
  Room,
  ActiveObj,
  WorldState,
  numCols,
  genGridArray,
} from './GridConstants.mjs';

import { setWorldFromId, updateWorldInDb } from './axiosRequests.jsx';
import BaseGrid from './BaseGrid.jsx';

require('babel-polyfill');

const getRow = (index) => Math.floor(index / numCols);
const getCol = (index) => index % numCols;
const colorPalette = ['#A09ABC', '#21A179', '#0B4F6C', '#FFC09F', '#FF5A5F'];

// change item built on click grid based on tool selected

const buildWallOnCell = (row, col, world, setWorld) => {
  console.log('building wall on cell');
  // color picked from dropdown list
  const color = colorPalette[0];
  const { board, wallCells } = world;

  const worldArr = world.board;
  if (board[row][col] === null || board[row][col].color === '') {
    board[row][col] = { ...board[row][col], color };
    // might not be needed
    // wallCells.push(new Wall(row, col, color));
  } else {
    board[row][col] = { ...board[row][col], color: '' };
  }
  setWorld({ ...world, board, wallCells });
};
const addCharToCell = (value, row, col, world, setWorld) => {
  console.log('adding char to cell');
  const { board } = world;
  board[row][col] = { ...board[row][col], charFill: value };
  setWorld({ ...world, board });
};
const BuildGrid = ({ items, world, setWorld }) => {
  console.log('rendering click grid');
  // const [boardArr, setBoardArr] = useState(items);
  const arr1d = [].concat(...items);
  // const arr1d = [].concat(...world.board);
  // on click, if square is empty, fill with new color
  // if not remove color

  // different click modes for wall, room and activeObject creation
  // wall creation
  console.log('arr1d :>> ', arr1d);
  const cells = arr1d.map((cell, index) => (
    <input
      type="text"
      maxLength="1"
      onMouseDown={() => {
        buildWallOnCell(getRow(index), getCol(index), world, setWorld);
      }}
      onChange={(e) => {
        addCharToCell(
          e.target.value,
          getRow(index),
          getCol(index),
          world,
          setWorld
        );
      }}
      style={{
        backgroundColor: cell === null ? cell : cell.color,
      }}
      className="cell gridBorder"
      key={`bg${getRow(index)}_${getCol(index)}`}
      value={cell !== null && cell.charFill !== '' ? cell.charFill : ''}
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
  // const [worldName, setWorldName] = useState();
  const worldName = useRef();
  const worldId = useRef();
  const [world, setWorld] = useState();

  const setWorldProperties = (world) => {
    const { id, userId, name, worldState } = world;
    const { board, activeObjCells, roomCells, wallCells } = worldState;
    worldId.current = id;
    worldName.current = name;

    setBackgrndArr(board);
    setWorld(worldState);
  };

  useEffect(() => {
    setWorldFromId(setWorldProperties);
  }, []);
  // use effect to update worldBackground when world is updated
  useEffect(() => {
    if (world !== undefined) {
      setBackgrndArr(world.board);
      updateWorldInDb(worldId.current, world);
    }
  }, [world]);
  return (
    <div className="pt-5">
      <h1>⚒ Editing {worldName.current}</h1>
      <BaseGrid items={backgrndArr} worldState={world} />

      <BuildGrid
        items={backgrndArr}
        setItems={setBackgrndArr}
        world={world}
        setWorld={setWorld}
      />
    </div>
  );
}
