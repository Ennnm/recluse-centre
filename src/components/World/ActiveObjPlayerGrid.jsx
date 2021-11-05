/* eslint-disable jsx-a11y/click-events-have-key-events, react/prop-types */
import React, { useState, useEffect, useContext, useRef } from 'react';
import { numCols, numRows, genGridArray } from './GridConstants.mjs';
import { SocketContext } from '../../contexts/sockets.mjs';
import { getRandomInt, getUserIdCookie } from '../../../utils.mjs';
import GridSquares from './GridSquares.jsx';

// const directionalKeyPresses = ['KeyA', 'KeyW', 'KeyD', 'KeyS'];

const directionalKeys = {
  KeyW: {
    vector: [0, -1],
    direction: 'top',
  },
  KeyS: {
    vector: [0, 1],
    direction: 'bottom',
  },
  KeyA: {
    vector: [-1, 0],
    direction: 'left',
  },
  KeyD: {
    vector: [1, 0],
    direction: 'right',
  },
};

const getDirVectorFromKeyCode = (code) => directionalKeys[code].vector;
const getDirectionVectors = () => {
  const keys = Object.keys(directionalKeys);
  return keys.map((key) => getDirVectorFromKeyCode(key));
};
const directions = getDirectionVectors();

const getGridObject = (x, y, grid) => grid[y][x];
const isWall = (obj) => {
  if (obj === null || obj.color === undefined || obj.color === '') {
    return false;
  }
  return true;
};

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
export default function ActiveObjPlayerGrid({
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
    y: 0,
    // y: getRandomInt(numRows / 2),
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

  const [isInputTxtFocused, setInputTxtFocused] = useState(false);
  const userSquare = useRef('');

  const socket = useContext(SocketContext);
  const userId = getUserIdCookie();

  // ======================START OF FUNCTIONS===============================

  const movePlayer = (x, y, oldX, oldY) => {
    const gridObj = getGridObject(x, y, backgrndArr);
    // check if player is hitting any walls
    if (!isWall(gridObj)) {
      setUserPosition({ x, y });
    } else {
      // if user is in the wall
      const currentGridObj = getGridObject(oldX, oldY, backgrndArr);
      if (isWall(currentGridObj)) {
        setUserPosition({ x, y });
      }
    }
  };
  const getAdjCells = () =>
    directions.map((dir) => movedPosition(userPosition, dir[0], dir[1]));

  const getAdjacentPlayers = () => {
    const adjCells = getAdjCells().filter((x) => x !== null);
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

  const handleDirKeys = (key) => {
    const direction = getDirVectorFromKeyCode(key);

    const movedLocation = movedPosition(
      userPosition,
      direction[0],
      direction[1]
    );
    if (movedLocation !== null) {
      movePlayer(
        movedLocation[0],
        movedLocation[1],
        userPosition.x,
        userPosition.y
      );
    }
  };

  const interactWPlayer = () => {
    let adjPlayerCell = getAdjacentPlayers();
    adjPlayerCell = adjPlayerCell.filter((player) => player !== userId);

    adjPlayerCell.forEach((player) => {
      console.log(`adjacent to player ${player}`);
    });
  };

  const getActiveAdjCells = () => {
    const adjCells = getAdjCells().filter((x) => x !== null);
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
  const openInteractiveObj = () => {
    const activeAdjCells = getActiveAdjCells();

    activeAdjCells.forEach((cell) => {
      window.open(cell.url);
    });
  };
  const handleInteractKey = () => {
    openInteractiveObj();
    interactWPlayer();
  };
  const handleBuildKey = () => {
    const userSquareChilds = userSquare.current.childNodes;
    userSquareChilds.forEach((child) => {
      const currDisplay = child.style.display;
      child.style.display = currDisplay === 'none' ? 'block' : 'none';
    });
  };

  const handlePlayersPositions = (playerPos) => {
    console.log('hanndling playing positions');
    // console.log('playerPos :>> ', playerPos);
    // remove existing copy
    playerPos = playerPos.map((row) =>
      row.map((cell) => (cell === userId ? null : cell))
    );
    const { x, y } = userPosition;
    playerPos[y][x] = userId;
    setPlayersPositions(playerPos);
  };
  // ======================END OF FUNCTIONS===============================
  useEffect(() => {
    // SOCKETS
    console.log('userPosition :>> ', userPosition);
    socket.emit('grid:join', { userId, worldId, userPosition });
  }, [socket]);

  useEffect(() => {
    console.log('in use effect key press handler');
    // KEY PRESSES
    const handleKeyPress = (e) => {
      if (!isChatFocused && !isInputTxtFocused) {
        if (Object.keys(directionalKeys).includes(e.code)) {
          handleDirKeys(e.code);
          if (buildTool.tool !== '') {
            setBuildTool({
              tool: '',
              color: '',
              roomId: 0,
              charFill: '',
              activeObjType: '',
              url: '',
            });
          }
        } else if (e.code === 'KeyE') {
          handleInteractKey();
        } else if (e.code === 'KeyB') {
          // get square of userPosition
          handleBuildKey(userPosition, userSquare, buildTool, setBuildTool);
        }
      }
    };
    document.addEventListener('keypress', handleKeyPress);
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [socket, userPosition, isChatFocused, isInputTxtFocused]);

  useEffect(() => {
    console.log('in use effect emitting and listening');
    // SOCKETS
    socket.emit('grid:update', {
      worldId,
      userId,
      x: userPosition.x,
      y: userPosition.y,
    });

    socket.on('PLAYER_POSITIONS', handlePlayersPositions);

    return () => {
      socket.off('PLAYER_POSITIONS', handlePlayersPositions);
    };
  }, [socket, userPosition]);

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
        setInputTxtFocused={setInputTxtFocused}
      />
    </>
  );
}
