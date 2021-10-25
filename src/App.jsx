import React, { useState, useEffect } from 'react';
import GridElem from './components/grid.jsx';

export default function App() {
  const handleKeyDown = (e) => {
    console.log('e.code :>> ', e.code);
    // TODO FIGURE OUT HOW TO LOG KEYBOARD EVENTS
    //  switch (e.code) {
    //    case 'keyA':
    //      movePlayer(-1, 0);
    //      break;
    //    case 'keyW':
    //      movePlayer(0, 1);
    //      break;
    //    case 'keyD':
    //      movePlayer(1, 0);
    //      break;
    //    case 'keyS':
    //      movePlayer(0, -1);

    //      break;
    //  }
  };

  return (
    <div>
      {/* <div onKeyDown={handleKeyDown}> */}
      <GridElem />
    </div>
  );
}
