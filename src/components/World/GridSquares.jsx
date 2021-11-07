/* eslint-disable react/prop-types */
import React from 'react';
import Square from './Square.jsx';

export default function GridSquares({
  activeCells,
  playersPositions,
  userSquare,
  userObj,
  world,
  setWorld,
  buildTool,
  setBuildTool,
  setInputTxtFocused,
  interactMode,
  modalDisplay,
}) {
  const activeObjGrid = playersPositions.map((arr) => arr.slice());
  activeCells.forEach((activity) => {
    const activityObj = {
      type: activity.type,
      url: activity.url,
    };
    activeObjGrid[activity.y][activity.x] = {
      ...activityObj,
    };
  });
  const active1dArr = [].concat(...activeObjGrid);
  const squares = active1dArr.map((actObj, i) => (
    <Square
      index={i}
      key={`sq${i.toString()}`}
      actObj={actObj}
      userObj={userObj}
      userSquare={userSquare}
      world={world}
      setWorld={setWorld}
      buildTool={buildTool}
      setBuildTool={setBuildTool}
      setInputTxtFocused={setInputTxtFocused}
      interactMode={interactMode}
      modalDisplay={modalDisplay}
    />
  ));
  return (
    <div
      id="baseGrid"
      className="grid-container position-absolute position-absolute-stretch"
    >
      {squares}
    </div>
  );
}
