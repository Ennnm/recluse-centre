import React, { useState, useCallback, useEffect, useContext } from 'react';
import { numCols, numRows, genGridArray } from './GridConstants.mjs';
import { SocketContext } from '../../contexts/sockets.mjs';
import {
  getRandomColor,
  getRandomInt,
  getUserIdCookie,
} from '../../../utils.mjs';

const movedPosition = (userPosition, x, y) => {
  let destinationX = userPosition.x;
  let destinationY = userPosition.y;

  if (destinationX + x >= 0 && destinationX + x < numCols) {
    destinationX += x;
  }
  if (destinationY + y >= 0 && destinationY + y < numRows) {
    destinationY += y;
  }
  return [destinationX, destinationY];
};
const directionalKeyPresses = ['KeyA', 'KeyW', 'KeyD', 'KeyS'];

const directions = {
  top: [0, -1],
  bottom: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

const getDisplacementFromKey = (code) => {
  let direction = [];
  switch (code) {
    case 'KeyA':
      direction = directions.left;
      break;
    case 'KeyW':
      direction = directions.top;
      break;
    case 'KeyD':
      direction = directions.right;
      break;
    case 'KeyS':
      direction = directions.bottom;
      break;
    default:
      direction = [0, 0];
      break;
  }
  let XY = [0, 0];
  XY = XY.map((coord, i) => coord + direction[i]);
  return XY;
};

const getGridObject = (x, y, grid) => grid[y][x];
const isWall = (obj) => {
  if (obj !== null && obj.color !== '') {
    return true;
  }
  return false;
};

const movePlayer = (x, y, oldX, oldY, backgrndArr, setUserPosition) => {
  const gridObj = getGridObject(x, y, backgrndArr);
  // check if player is hitting any walls

  if (!isWall(gridObj)) {
    setUserPosition({ x, y });
  } else {
    // if user is in the wall
    const currentGrid = getGridObject(oldX, oldY, backgrndArr);
    if (isWall(currentGrid)) {
      setUserPosition({ x, y });
    }
  }
};
const getActiveAdjCells = (userPosition, activeCells) => {
  const directionValues = Object.values(directions);
  const adjCells = directionValues.map((dir) =>
    movedPosition(userPosition, dir[0], dir[1])
  );
  const activeAdjCells = [];
  for (let i = 0; i < activeCells.length; i += 1) {
    const activeCell = activeCells[i];

    for (let j = 0; j < adjCells.length; j += 1) {
      const adjCell = adjCells[j];
      console.log('adjCell :>> ', adjCell);
      if (activeCell.x === adjCell[0] && activeCell.y === adjCell[1]) {
        activeAdjCells.push(activeCell);
      }
    }
  }
  return activeAdjCells;
};
const clickOnCell = (obj) => {
  console.log('cell clicked', obj);
  window.open(obj.url);
};
const iconFromObjType = (obj) => {
  let img = '';
  switch (obj.type) {
    case 'zoom':
      img = 'zoom.png';
      break;
    case 'note':
      img = 'sticky_notes.png';
      break;
    case 'lucid':
      img = 'lucid.png';
      break;
    case 'figma':
      img = 'figma.png';
      break;
    default:
      break;
  }

  return img;
};
const clickOnPlayer = (player) => {
  console.log(`This is player ${player}`);
};
const Square = ({ backgrnd, player, index }) => {
  console.log('in squares');
  let fill = <div className="cell gridBorder" />;
  // if (backgrnd.color!='' || backgrnd.charFill){
  if (backgrnd !== null) {
    if ('url' in backgrnd) {
      fill = (
        <input
          className="cell gridBorder"
          type="image"
          src={iconFromObjType(backgrnd)}
          onClick={() => {
            clickOnCell(backgrnd);
          }}
          key={`active${Math.floor(index / numCols)}_${index % numCols}`}
          alt={backgrnd.type}
        />
      );
    } else if ('color' in backgrnd || 'charFill' in backgrnd) {
      fill = (
        <div
          className="cell gridBorder"
          key={`backgrnd${Math.floor(index / numCols)}_${index % numCols}`}
          style={{
            backgroundColor: backgrnd.color,
          }}
        >
          {backgrnd.charFill}
        </div>
      );
    }
  } else if (player !== null) {
    fill = (
      <input
        onClick={() => {
          clickOnPlayer(player);
        }}
        type="image"
        className="cell gridBorder"
        src={`https://avatars.dicebear.com/api/big-smile/${player + 1}.svg`}
        alt="profile pic"
      />
    );
  }

  return <>{fill}</>;
};

const GridSquares = ({ backgrndArr, activeCells, playersPositions }) => {
  console.log('in gridsquares');
  console.log('activeCells :>> ', activeCells);
  console.log('backgrndArr :>> ', backgrndArr[0]);
  activeCells.forEach((activity) => {
    const activityObj = {
      type: activity.type,
      url: activity.url,
    };
    const backgrndObj = backgrndArr[activity.y][activity.x];

    if (backgrndObj === null) {
      backgrndArr[activity.y][activity.x] = activityObj;
    } else {
      backgrndArr[activity.y][activity.x] = { ...backgrndObj, ...activityObj };
    }
  });

  const backgrndArr1d = [].concat(...backgrndArr);
  const playerPos1d = [].concat(...playersPositions);
  console.log('playerPos1d :>> ', playerPos1d);

  const squares = backgrndArr1d.map((backgrnd, i) => (
    <Square index={i} backgrnd={backgrnd} player={playerPos1d[i]} />
  ));

  return (
    <div id="baseGrid" className="grid-container position-absolute ">
      {squares}
    </div>
  );
};
export default function CombinedGrid({
  backgrndArr,
  activeCells,
  isChatFocused,
  worldId,
}) {
  console.log('in combined grid');
  console.log('worldId :>> ', worldId);
  const [userPosition, setUserPosition] = useState({
    x: getRandomInt(numCols),
    y: getRandomInt(numRows),
  });
  const [playersPositions, setPlayersPositions] = useState(genGridArray());

  const socket = useContext(SocketContext);
  const userId = getUserIdCookie();
  // link with pages/db

  const handlePlayersPositions = useCallback((playerPos) => {
    const { x, y } = userPosition;
    playerPos[y][x] = userId;
    setPlayersPositions(playerPos);
  });

  useEffect(() => {
    // getting world data of players
    socket.emit('grid:join', { userId, worldId });
  }, [socket]);
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isChatFocused) {
        if (directionalKeyPresses.includes(e.code)) {
          const [displacementX, displacementY] = getDisplacementFromKey(e.code);

          const [x, y] = movedPosition(
            userPosition,
            displacementX,
            displacementY
          );
          movePlayer(
            x,
            y,
            userPosition.x,
            userPosition.y,
            backgrndArr,
            setUserPosition
          );
        } else if (e.code === 'KeyE') {
          const activeAdjCells = getActiveAdjCells(userPosition, activeCells);
          // compare with users too

          activeAdjCells.forEach((cell) => {
            window.open(cell.url);
          });
        }
      }
    };
    document.addEventListener('keypress', handleKeyPress);
    socket.emit('grid:update', {
      worldId,
      userId,
      x: userPosition.x,
      y: userPosition.y,
    });

    socket.on('PLAYER_POSITIONS', handlePlayersPositions);

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
      socket.off('PLAYER_POSITIONS', handlePlayersPositions);
    };
  }, [socket, userPosition, isChatFocused]);

  return (
    <GridSquares
      backgrndArr={backgrndArr}
      activeCells={activeCells}
      playersPositions={playersPositions}
    />
  );
  // return (
  //   <div id="baseGrid" className="grid-container position-absolute ">
  //     {cells}
  //   </div>
  // );
}
