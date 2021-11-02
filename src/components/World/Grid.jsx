import React, { useState, useRef, useEffect } from 'react';
import { genGridArray } from './GridConstants.mjs';
import BaseGrid from './BaseGrid.jsx';
import PlayersGrid from './PlayersGrid.jsx';
import ClickGrid from './ClickGrid.jsx';
import CombinedGrid from './CombinedGrid.jsx';
import CombClickAndPlayerGrid from './CombClickAndPlayerGrid.jsx';

import { setWorldFromId } from './axiosRequests.jsx';

export default function GridElem({ isChatFocused, room }) {
  console.log('room in GridElem :>> ', room);
  // to read from db
  const [backgrndArr, setBackgrndArr] = useState(genGridArray());
  const [clickableCells, setClickCells] = useState([]);

  const worldName = useRef();
  const worldId = useRef();

  function setWorldProperties(world) {
    const { id, userId, name, worldState } = world;
    const { board, activeObjCells, roomCells, wallCells } = worldState;
    worldId.current = id;
    worldName.current = name;

    setBackgrndArr(board);
    setClickCells(activeObjCells);
  }
  useEffect(() => {
    console.log('setting world from id');
    // getting background from db, refresh all react worlds on new edit?
    setWorldFromId(setWorldProperties, room);
  }, []);

  return (
    <>
      <BaseGrid items={backgrndArr} />
      {/* <PlayersGrid
        backgrndArr={backgrndArr}
        activeCells={clickableCells}
        isChatFocused={isChatFocused}
      />
      <ClickGrid items={clickableCells} /> */}
      <CombClickAndPlayerGrid
        backgrndArr={backgrndArr}
        activeCells={clickableCells}
        isChatFocused={isChatFocused}
        worldId={room}
      />
      {/* VERY BAD PERFORMANCE
       <CombinedGrid
        backgrndArr={backgrndArr}
        activeCells={clickableCells}
        isChatFocused={isChatFocused}
        worldId={room}
      /> */}
    </>
  );
}
