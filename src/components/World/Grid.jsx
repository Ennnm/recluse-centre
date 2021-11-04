import React, { useState, useRef, useEffect } from 'react';
import { genGridArray } from './GridConstants.mjs';
import BaseGrid from './BaseGrid.jsx';
import PlayersGrid from './PlayersGrid.jsx';
import ClickGrid from './ClickGrid.jsx';
import CombinedGrid from './CombinedGrid.jsx';
import ActiveObjPlayerGrid from './ActiveObjPlayerGrid.jsx';

import { setWorldFromId } from './axiosRequests.jsx';

export default function GridElem({ isChatFocused, room }) {
  console.log('room in GridElem :>> ', room);
  // to read from db
  const [backgrndArr, setBackgrndArr] = useState(genGridArray());
  const [clickableCells, setClickCells] = useState([]);
  // db world
  const [world, setWorld] = useState();

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
  }, [world]);

  return (
    <>
      <BaseGrid items={backgrndArr} />
      {/*
        this invisible grid is necessary for setting the height of page, because
        parent elements can't follow the height of absolute positioned children.
        it will be required for me to set a padding to the bottom of invisible base grid
      */}
      <BaseGrid items={backgrndArr} visibility={false} />
      {/* <PlayersGrid
        backgrndArr={backgrndArr}
        activeCells={clickableCells}
        isChatFocused={isChatFocused}
      />
      <ClickGrid items={clickableCells} /> */}
      <ActiveObjPlayerGrid
        backgrndArr={backgrndArr}
        activeCells={clickableCells}
        isChatFocused={isChatFocused}
        worldId={room}
        setBackgrndArr={setBackgrndArr}
        setClickCells={setClickCells}
        world={world}
        setWorld={setWorld}
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
