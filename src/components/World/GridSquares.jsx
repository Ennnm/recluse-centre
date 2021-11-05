import React, { useContext } from 'react';
import Square from './Square.jsx';

export default function GridSquares({
  activeCells,
  setActiveCells,
  playersPositions,
  userSquare,
  userId,
  world,
  setWorld,
  buildTool,
  setBuildTool,
  setInputTxtFocused,
}) {
  activeCells.forEach((activity) => {
    const activityObj = {
      type: activity.type,
      url: activity.url,
    };
    playersPositions[activity.y][activity.x] = {
      ...activityObj,
    };
  });

  const activeObjOnGrid = [].concat(...playersPositions);
  const squares = activeObjOnGrid.map((actObj, i) => (
    <Square
      key={`sq_${i.toString()}`}
      index={i}
      player={actObj}
      userId={userId}
      userSquare={userSquare}
      world={world}
      setWorld={setWorld}
      buildTool={buildTool}
      setBuildTool={setBuildTool}
      setInputTxtFocused={setInputTxtFocused}
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
