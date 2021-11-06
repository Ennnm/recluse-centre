/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
// CUSTOM IMPORTS
import { World } from '../World/utils.mjs';
import IndexBaseGrid from './IndexBaseGrid.jsx';
import { setWorldFromId } from '../World/axiosRequests.mjs';

// eslint-disable-next-line react/prop-types
export default function IndexPage() {
  const [world, setWorld] = useState(new World(2));
  const handleUpdateWorld = () => {
    setWorldFromId(setWorld, 2);
  };

  useEffect(() => {
    // getting background from db, refresh all react worlds on new edit?
    handleUpdateWorld();
  }, []);

  return (
    <>
      <IndexBaseGrid world={world} />
    </>
  );
}
