/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { numCols, genGridArray } from './utils.mjs';

import { setWorldFromId, updateWorldInDb } from './axiosRequests.mjs';

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
const BuildGrid = ({ items, world, setWorld, activeObjs }) => {
  console.log('rendering click grid');
  const arr1d = [].concat(...items);
  const cells = arr1d.map((cell, index) => (
    <input
      type="text"
      maxLength="2"
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
    <>
      <div
        id="BuildGrid"
        style={{ zIndex: 4, cursor: 'grab' }}
        className="grid-container position-absolute position-absolute-stretch"
      >
        {cells}
      </div>
    </>
  );
};

const WallTools = ({ setBuildTool }) => {
  const hexColors = hslPalette(10, 100, 70);
  const palettePicker = hexColors.map((color) => (
    <button
      type="button"
      className="cell px-1 gridBorder"
      onClick={() => {
        setBuildTool({ tool: 'wall_paint', color });
        console.log('color :>> ', color);
      }}
      style={{
        backgroundColor: color,
      }}
    >
      <FontAwesomeIcon icon={['fas', 'coffee']} />
    </button>
  ));
  const textPicker = (
    <button
      type="button"
      className="cell px-1 gridBorder"
      onClick={() => {
        setBuildTool({ tool: 'wall_text' });
      }}
      style={{
        font: 'Garamond, serif',
      }}
    >
      T
    </button>
  );
  return (
    <>
      <h3>Wall Color</h3>
      <div className="flex-row">{palettePicker}</div>
      <h3>Fill wall with character</h3>
      {textPicker}
    </>
  );
};
const RoomFiller = ({ setBuildTool }) => {
  const hexColors = hslPalette(10, 100, 85);
  const palettePicker = hexColors.map((color) => (
    <button
      type="button"
      className="cell px-1 gridBorder"
      onClick={() => {
        setBuildTool({ tool: 'room_paint', color });
        console.log('color :>> ', color);
      }}
      style={{
        backgroundColor: color,
      }}
    >
      <FontAwesomeIcon icon={['fas', 'coffee']} />
    </button>
  ));
  return (
    <>
      <h3>Room Color</h3>
      <h5>1 room: 1 color</h5>
      <div className="flex-row">{palettePicker}</div>
    </>
  );
};
const ActiveObjFiller = ({ setBuildTool }) => {
  // option for player to drag and drop square icon
  // fill some descriptive text that appears when cursor hovers over
  // or pops up with user comes near
  const jsx = 'blerp';
  return <></>;
};

const BuildingTools = ({ setBuildTool, worldName }) => (
  <div className="d-flex flex-column align-items-stretch chat-wrapper px-5">
    <h1>??? Editing {worldName}</h1>
    <FontAwesomeIcon icon={['fas', 'coffee']} />
    <WallTools setBuildTool={setBuildTool} />
    <RoomFiller setBuildTool={setBuildTool} />
    <ActiveObjFiller setBuildTool={setBuildTool} />
  </div>
);

export default function EditWorld() {
  // to read from db

  const [backgrndArr, setBackgrndArr] = useState(genGridArray());
  const [activeObjs, setActiveObjs] = useState([]);
  // const [worldName, setWorldName] = useState();
  const worldName = useRef();
  const worldId = useRef();
  const [world, setWorld] = useState();
  const [buildTool, setBuildTool] = useState();

  const setWorldProperties = (world) => {
    const { id, userId, name, worldState } = world;
    const { board, activeObjCells, roomCells, wallCells } = worldState;
    worldId.current = id;
    worldName.current = name;

    setBackgrndArr(board);
    setWorld(worldState);
    setActiveObjs(activeObjCells);
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
    <div>
      <BuildGrid
        items={backgrndArr}
        setItems={setBackgrndArr}
        world={world}
        setWorld={setWorld}
        activeObjs={activeObjs}
        buildTool={buildTool}
      />
    </div>
  );
}
