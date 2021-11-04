import React, { useState, useRef, useEffect } from 'react';
import { genGridArray, WorldState, World } from './GridConstants.mjs';
import BaseGrid from './BaseGrid.jsx';
import PlayersGrid from './PlayersGrid.jsx';
import ClickGrid from './ClickGrid.jsx';
import CombinedGrid from './CombinedGrid.jsx';
import ActiveObjPlayerGrid from './ActiveObjPlayerGrid.jsx';

import { setWorldFromId, updateWorldInDb } from './axiosRequests.jsx';

export default function GridElem({ isChatFocused, room }) {
  console.log('room in GridElem :>> ', room);
  // to read from db
  // db world
  const [world, setWorld] = useState(new World());

  const worldName = useRef();
  const worldId = useRef();
  console.log('setWorld :>> ', setWorld);

  function setWorldProperties(world) {
    console.log('world from setWorld :>> ', world);
    worldId.current = world.id;
    worldName.current = world.name;
    // rerendeering three times?
    setWorld(world);
  }
  useEffect(() => {
    console.log('setting world from id');
    // getting background from db, refresh all react worlds on new edit?
    setWorldFromId(setWorldProperties, room);
  }, []);

  useEffect(() => {
    console.log('the world has changed');
    if (world !== undefined) {
      updateWorldInDb(worldId.current, world.worldState);
    }
  }, [world]);

  return (
    <>
      <BaseGrid world={world} />
      {/*
        this invisible grid is necessary for setting the height of page, because
        parent elements can't follow the height of absolute positioned children.
        it will be required for me to set a padding to the bottom of invisible base grid
      */}
      <BaseGrid world={world} visibility={false} />
      <ActiveObjPlayerGrid
        isChatFocused={isChatFocused}
        worldId={room}
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
