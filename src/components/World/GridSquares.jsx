import React, { useContext } from 'react';
import Square from './Square.jsx';
import { SocketContext } from '../../contexts/sockets.mjs';

export default function GridSquares({
  activeCells,
  playersPositions,
  userSquare,
  userId,
  world,
  setWorld,
  buildTool,
  setBuildTool,
}) {
  const socket = useContext(SocketContext);

  activeCells.forEach((activity) => {
    const activityObj = {
      type: activity.type,
      url: activity.url,
    };
    playersPositions[activity.y][activity.x] = {
      ...activityObj,
    };
  });

  const playerPos1d = [].concat(...playersPositions);
  const squares = playerPos1d.map((player, i) => (
    <Square
      key={`sq_${i.toString()}`}
      index={i}
      player={player}
      userId={userId}
      userSquare={userSquare}
      world={world}
      setWorld={setWorld}
      buildTool={buildTool}
      setBuildTool={setBuildTool}
      socket={socket}
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
