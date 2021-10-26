import React, { useState, useRef, useEffect } from 'react';
import { numCols, numRows, genGridArray } from './GridConstants.jsx';
import BaseGrid from './BaseGrid.jsx';
import PlayersGrid from './PlayersGrid.jsx';
import ClickGrid from './ClickGrid.jsx';

export default function GridElem() {
  // to read from db
  const [backgrndArr, setBackgrndArr] = useState(genGridArray());
  const [playerPos, setPlayerPos] = useState(genGridArray());
  const [clickableCells, setClickCells] = useState(genGridArray());

  // world state get from db
  const [worldState, setWorldState] = useState({
    rooms: [],
    walls: [],
    actionObjects: [],
  });

  // function to add wall, define room, add actionObjects
  const editWorldState = () => {};
  console.log('rendering grid elem');
  console.log('playerPos :>> ', playerPos);

  return (
    <>
      <BaseGrid items={backgrndArr} worldState={worldState} />
      <PlayersGrid items={playerPos} />
      <ClickGrid items={clickableCells} />
    </>
  );
}
