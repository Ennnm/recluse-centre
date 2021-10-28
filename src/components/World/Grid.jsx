import React, { useState, useRef, useEffect } from 'react';
import { genGridArray } from './GridConstants.mjs';
import BaseGrid from './BaseGrid.jsx';
import PlayersGrid from './PlayersGrid.jsx';
import ClickGrid from './ClickGrid.jsx';

import { setWorldFromId } from './axiosRequests.jsx';

export default function GridElem() {
  // to read from db
  const [backgrndArr, setBackgrndArr] = useState(genGridArray());
  const [clickableCells, setClickCells] = useState(genGridArray());

  const worldName = useRef();
  const worldId = useRef();

  function setWorldProperties(world) {
    const { id, userId, name, worldState } = world;
    const { board, activeObjCells, roomCells, wallCells } = worldState;
    worldId.current = id;
    worldName.current = name;

    setBackgrndArr(board);
  }
  useEffect(() => {
    setWorldFromId(setWorldProperties);
  }, []);
  // world state get from db
  const [worldState, setWorldState] = useState({
    rooms: [],
    walls: [],
    actionObjects: [],
  });
  useEffect(() => {
    setWorldFromId();
  });
  // function to add wall, define room, add actionObjects

  return (
    <>
      <BaseGrid items={backgrndArr} worldState={worldState} />
      <PlayersGrid backgrndArr={backgrndArr} />
      <ClickGrid items={clickableCells} />
    </>
  );
}
