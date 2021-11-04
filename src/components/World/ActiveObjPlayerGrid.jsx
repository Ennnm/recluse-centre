/* eslint-disable jsx-a11y/click-events-have-key-events, react/prop-types */
import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from 'react';
import {
  numCols,
  numRows,
  genGridArray,
  rowFromIndex,
  colFromIndex,
} from './GridConstants.mjs';
import { SocketContext } from '../../contexts/sockets.mjs';
import { getRandomInt, getUserIdCookie } from '../../../utils.mjs';
import UserModal from './UserModal.jsx';

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

  return adjPlayers;
};
const clickOnCell = (obj) => {
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

const buildOnCell = (index, world, setWorld, buildTool) => {
  const row = rowFromIndex(index);
  const col = colFromIndex(index);
  const { board } = world.worldState;
  console.log('cell is clicked');
  if (buildTool.tool === 'wall') {
    console.log('row :>> ', row);
    console.log('col :>> ', col);
    world.worldState.board[row][col] = {
      ...board[row][col],
      color: buildTool.color,
    };
    world.worldState.board = board;
    // why not working?
    setWorld({ ...world });
  }
  // build tool
  // {
  //   tool: '',
  //   color: '',
  //   roomId: 0,
  //   charFill: '',
  //   activeObjType: '',
  //   url: '',
  // }
};

const Square = ({
  player,
  index,
  userId,
  userSquare,
  world,
  setWorld,
  buildTool,
  setBuildTool,
}) => {
  const buildToolType = buildTool.type;
  // need to get x and y coordinate to update world board
  let fill = (
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      role={buildToolType !== '' ? 'button' : 'none'}
      tabIndex="0"
      className="cell gridBorder"
      onClick={() => {
        if (buildToolType !== '') {
          buildOnCell(index, world, setWorld, buildTool);
        }
      }}
    />
  );
  if (player !== null) {
    if (typeof player === 'object') {
      fill = (
        <input
          className="cell gridBorder"
          type="image"
          src={iconFromObjType(player)}
          onClick={() => {
            if (buildToolType === '') {
              clickOnCell(player);
            } else {
              buildOnCell(index, world, setWorld, buildTool);
            }
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
            if (buildToolType === '') {
              clickOnPlayer(player);
            } else {
              buildOnCell(index, world, setWorld, buildTool);
            }
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
          <UserModal userSquare={userSquare} setBuildTool={setBuildTool} />
        </div>
      );
    } else {
      fill = (
        <input
          onClick={() => {
            if (buildToolType === '') {
              clickOnPlayer(player);
            } else {
              buildOnCell(index, world, setWorld, buildTool);
            }
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

const GridSquares = ({
  activeCells,
  playersPositions,
  userSquare,
  userId,
  world,
  setWorld,
  buildTool,
  setBuildTool,
}) => {
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
const handleBuildKey = (
  userPosition,
  userSquare,
  setModalUp,
  buildTool,
  setBuildTool
) => {
  const userSquareChilds = userSquare.current.childNodes;
  userSquareChilds.forEach((child) => {
    const currDisplay = child.style.display;
    child.style.display = currDisplay === 'none' ? 'block' : 'none';
  });

  const modal = (
    <div>
      User at x :{userPosition.x}, y: {userPosition.y}
    </div>
  );
  setModalUp(modal);
};
export default function ActiveObjPlayerGrid({
  // backgrndArr,
  // activeCells,
  isChatFocused,
  worldId,
  world,
  setWorld,
}) {
  const backgrndArr = world.worldState.board;
  const activeCells = world.worldState.activeObjCells;
  console.log('in active obj');
  const [userPosition, setUserPosition] = useState({
    x: getRandomInt(numCols),
    y: getRandomInt(numRows / 2),
  });
  const [playersPositions, setPlayersPositions] = useState(genGridArray());
  const [buildTool, setBuildTool] = useState({
    tool: '',
    color: '',
    roomId: 0,
    charFill: '',
    activeObjType: '',
    url: '',
  });
  console.log('buildTool :>> ', buildTool);
  console.log('world in active :>> ', world);
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
    console.log('world in active has changed');
  }, [world]);
  useEffect(() => {
    // SOCKETS
    socket.emit('grid:join', { userId, worldId });
  }, [socket]);
  useEffect(() => {
    // KEY PRESSES
    const handleKeyPress = (e) => {
      if (!isChatFocused) {
        if (directionalKeyPresses.includes(e.code)) {
          handleDirKeys(e.code, userPosition, backgrndArr, setUserPosition);
          setBuildTool({
            tool: '',
            color: '',
            roomId: 0,
            charFill: '',
            activeObjType: '',
            url: '',
          });
        } else if (e.code === 'KeyE') {
          handleInteractKey(
            userPosition,
            activeCells,
            playersPositions,
            userId
          );
        } else if (e.code === 'KeyB') {
          // get square of userPosition
          handleBuildKey(
            userPosition,
            userSquare,
            setModalUp,
            buildTool,
            setBuildTool
          );
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
        world={world}
        setWorld={setWorld}
        buildTool={buildTool}
        setBuildTool={setBuildTool}
      />
    </>
  );
}
