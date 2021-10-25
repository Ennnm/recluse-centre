import React, { useState, useEffect } from 'react';
import GridElem from './components/grid.jsx';

export default function App() {
  console.log('rendering app');
  return (
    <div>
      {/* <div onKeyDown={handleKeyDown}> */}
      <GridElem />
    </div>
  );
}
