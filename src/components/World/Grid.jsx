import React, { useState, useEffect, useContext, useCallback } from 'react';
import { World } from './GridConstants.mjs';
import BaseGrid from './BaseGrid.jsx';
import ActiveObjPlayerGrid from './ActiveObjPlayerGrid.jsx';
import { SocketContext } from '../../contexts/sockets.mjs';

import { setWorldFromId } from './axiosRequests.jsx';

export default function GridElem({ isChatFocused, room }) {
  console.log('gridElem update');
  // to read from db
  // db world
  const [world, setWorld] = useState(new World(room));

  const socket = useContext(SocketContext);

  function setWorldProperties(world) {
    console.log('world from setWorld :>> ', world);
    // rerendeering three times?
    setWorld(world);
  }

  const handleUpdateWorld = useCallback(() => {
    console.log('handling update  of world', world.id);
    setWorldFromId(setWorldProperties, world.id);
  });
  useEffect(() => {
    // getting background from db, refresh all react worlds on new edit?
    handleUpdateWorld();
  }, []);

  useEffect(() => {
    console.log('running because of  socket');
    socket.on('UPDATE_BASEGRID', handleUpdateWorld);
    return () => {
      socket.off('UPDATE_BASEGRID', handleUpdateWorld);
    };
  }, [socket]);

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
