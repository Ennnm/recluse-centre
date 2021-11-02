/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from 'react';
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

  if (x !== 0 && destinationX + x >= 0 && destinationX + x < numCols) {
    destinationX += x;
    return [destinationX, destinationY];
  }
  if (y !== 0 && destinationY + y >= 0 && destinationY + y < numRows) {
    destinationY += y;
    return [destinationX, destinationY];
  }

  return null;
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
      direction = [];
      break;
  }
  return direction;
  // let XY = [0, 0];
  // XY = XY.map((coord, i) => coord + direction[i]);
  // return XY;
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
const getAdjCells = (userPosition) => {
  const directionValues = Object.values(directions);
  return directionValues.map((dir) =>
    movedPosition(userPosition, dir[0], dir[1])
  );
};

const getActiveAdjCells = (userPosition, activeCells) => {
  const adjCells = getAdjCells(userPosition).filter((x) => x !== null);
  const activeAdjCells = [];
  for (let i = 0; i < activeCells.length; i += 1) {
    const activeCell = activeCells[i];

    for (let j = 0; j < adjCells.length; j += 1) {
      const adjCell = adjCells[j];
      if (activeCell.x === adjCell[0] && activeCell.y === adjCell[1]) {
        activeAdjCells.push(activeCell);
      }
    }
  }
  return activeAdjCells;
};
const getAdjacentPlayers = (userPosition, playersPositions) => {
  const adjCells = getAdjCells(userPosition).filter((x) => x !== null);
  const adjPlayers = [];
  for (let j = 0; j < adjCells.length; j += 1) {
    const adjCell = adjCells[j];
    const [x, y] = adjCell;
    const playerCell = playersPositions[y][x];

    if (playerCell !== null) {
      adjPlayers.push(playerCell);
    }
  }
  console.log('adjPlayers :>> ', adjPlayers);

  return adjPlayers;
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

const ToolsModal = (userSquare) => {
  const lalala = 5;
  console.log('userSquare in tools :>> ', userSquare);
  return <div style={{ display: 'none' }}>hey</div>;
};
React.forwardRef(ToolsModal);
const Square = ({ player, index, userId, userSquare }) => {
  let fill = <div className="cell gridBorder" />;
  if (player !== null) {
    if (typeof player === 'object') {
      fill = (
        <input
          className="cell gridBorder"
          type="image"
          src={iconFromObjType(player)}
          onClick={() => {
            clickOnCell(player);
          }}
          key={`active${index}`}
          alt={player.type}
        />
      );
    } else if (player === userId) {
      fill = (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          onClick={() => {
            clickOnPlayer(player);
          }}
          ref={userSquare}
          type="image"
          className="cell gridBorder"
          style={{
            backgroundImage: `url("https://avatars.dicebear.com/api/big-smile/${
              player + 1
            }.svg")`,
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <ToolsModal userSquare={userSquare} />
        </div>
      );
    } else {
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
  }

  return fill;
};

const GridSquares = ({ activeCells, playersPositions, userSquare, userId }) => {
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
    <Square index={i} player={player} userId={userId} userSquare={userSquare} />
  ));

  return (
    <div id="baseGrid" className="grid-container position-absolute ">
      {squares}
    </div>
  );
};

const handleDirKeys = (key, userPosition, backgrndArr, setUserPosition) => {
  const direction = getDisplacementFromKey(key);

  const movedLocation = movedPosition(userPosition, direction[0], direction[1]);
  if (movedLocation !== null) {
    movePlayer(
      movedLocation[0],
      movedLocation[1],
      userPosition.x,
      userPosition.y,
      backgrndArr,
      setUserPosition
    );
  }
};
const openInteractiveObj = (userPosition, activeCells) => {
  const activeAdjCells = getActiveAdjCells(userPosition, activeCells);

  activeAdjCells.forEach((cell) => {
    window.open(cell.url);
  });
};
const interactWPlayer = (userPosition, playersPositions, userId) => {
  let adjPlayerCell = getAdjacentPlayers(userPosition, playersPositions);
  adjPlayerCell = adjPlayerCell.filter((player) => player !== userId);

  adjPlayerCell.forEach((player) => {
    console.log(`adjacent to player ${player}`);
  });
};
const handleInteractKey = (
  userPosition,
  activeCells,
  playersPositions,
  userId
) => {
  openInteractiveObj(userPosition, activeCells);
  interactWPlayer(userPosition, playersPositions, userId);
};
const handleBuildKey = (userPosition, userSquare, setModalUp) => {
  // console.log('userSquare.current :>> ', userSquare.current);
  const userSquareChilds = userSquare.current.childNodes;
  console.log('userSquareChilds :>> ', userSquareChilds);
  userSquareChilds.forEach((child) => {
    const currDisplay = child.style.display;
    child.style.display = currDisplay === 'none' ? 'block' : 'none';
  });

  console.log('hey we are building!');
  const modal = (
    <div>
      User at x :{userPosition.x}, y: {userPosition.y}
    </div>
  );
  setModalUp(modal);
};
export default function CombClickAndPlayerGrid({
  backgrndArr,
  activeCells,
  isChatFocused,
  worldId,
}) {
  const [userPosition, setUserPosition] = useState({
    x: getRandomInt(numCols),
    y: getRandomInt(numRows),
  });
  const [playersPositions, setPlayersPositions] = useState(genGridArray());
  const [modalPopUp, setModalUp] = useState();
  const userSquare = useRef('dasda');

  const socket = useContext(SocketContext);
  const userId = getUserIdCookie();
  // link with pages/db

  const handlePlayersPositions = useCallback((playerPos) => {
    const { x, y } = userPosition;
    playerPos[y][x] = userId;
    setPlayersPositions(playerPos);
  });

  useEffect(() => {
    // SOCKETS
    socket.emit('grid:join', { userId, worldId });
  }, [socket]);
  useEffect(() => {
    console.log('running :>> ');
    console.log('userSquare :>> ', userSquare);
    // KEY PRESSES
    const handleKeyPress = (e) => {
      if (!isChatFocused) {
        if (directionalKeyPresses.includes(e.code)) {
          handleDirKeys(e.code, userPosition, backgrndArr, setUserPosition);
        } else if (e.code === 'KeyE') {
          handleInteractKey(
            userPosition,
            activeCells,
            playersPositions,
            userId
          );
        } else if (e.code === 'KeyB') {
          // get square of userPosition
          handleBuildKey(userPosition, userSquare, setModalUp);
        }
      }
    };
    document.addEventListener('keypress', handleKeyPress);
    // SOCKETS
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
    <>
      <GridSquares
        id="gridSquares"
        activeCells={activeCells}
        playersPositions={playersPositions}
        userSquare={userSquare}
        userId={userId}
      />
      {modalPopUp}
    </>
  );
}
