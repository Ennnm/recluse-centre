import React, { useState, useEffect, useContext } from 'react';
import { World } from './utils.mjs';
import BaseGrid from './BaseGrid.jsx';
import DummyGrid from './DummyGrid.jsx';
import ActiveObjPlayerGrid from './ActiveObjPlayerGrid.jsx';
import { SocketContext } from '../../contexts/sockets.mjs';

import { setWorldFromId } from './axiosRequests.mjs';

export default function GridElem({ isChatFocused, room }) {
  console.log('gridElem update');
  // to read from db
  // db world
  const [world, setWorld] = useState(new World(room));

  const socket = useContext(SocketContext);

  const handleUpdateWorld = () => {
    console.log('handling update  of world', world.id);
    setWorldFromId(setWorld, world.id);
  };
  useEffect(() => {
    console.log('use effecting getting world from db');
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
      <DummyGrid />
      <ActiveObjPlayerGrid
        isChatFocused={isChatFocused}
        worldId={room}
        world={world}
        setWorld={setWorld}
      />
    </>
  );
}
