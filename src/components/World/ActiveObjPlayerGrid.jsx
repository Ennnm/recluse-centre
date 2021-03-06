/* eslint-disable jsx-a11y/click-events-have-key-events, react/prop-types */
import React, {
  useState, useEffect, useContext, useRef,
} from 'react';
import axios from 'axios';
import { numCols, numRows, genGridArray } from './utils.mjs';
import { SocketContext } from '../../contexts/sockets.mjs';
import { getRandomInt, getUserIdCookie } from '../../../utils.mjs';
import GridSquares from './GridSquares.jsx';

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

const squareInDirection = (userPosition, x, y) => {
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
  const [userPosition, setUserPosition] = useState({
    x: 3 + getRandomInt(5),
    y: 8 + getRandomInt(5),
    // y: getRandomInt(numRows / 2),
  });
  const [playersPositions, setPlayersPositions] = useState(genGridArray());
  const [buildTool, setBuildTool] = useState({
    flag: false,
    tool: '',
    color: '',
    roomId: 0,
    charFill: '',
    activeObjType: '',
    url: '',
    title: '',
  });

  const [interactMode, setInteractMode] = useState([]);
  const [modalDisplay, setModalDisplay] = useState(null);
  const [isInputTxtFocused, setInputTxtFocused] = useState(false);
  const [activeCells, setActiveCells] = useState([]);
  const userId = getUserIdCookie();

  const [userObj, setUserObj] = useState({
    id: userId,
    realName: '',
    username: '',
    description: '',
  });
  const userSquare = useRef('');

  const socket = useContext(SocketContext);

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
  const getAdjCells = () => directions.map(
    (dir) => squareInDirection(userPosition, dir[0], dir[1]),
  );

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

    const movedLocation = squareInDirection(
      userPosition,
      direction[0],
      direction[1],
    );
    if (movedLocation !== null) {
      movePlayer(
        movedLocation[0],
        movedLocation[1],
        userPosition.x,
        userPosition.y,
      );
    }
  };

  const adjPlayersNotSelf = () => {
    let adjPlayerCell = getAdjacentPlayers();
    adjPlayerCell = adjPlayerCell.filter((player) => player.id !== userId);

    console.log('adjPlayerCell :>> ', adjPlayerCell);
    console.log('interactWplyaer :>> ', interactMode);

    // setInteractMode([...interactMode, ...adjPlayerCell]);

    // adjPlayerCell.forEach((player) => {
    //   console.log(
    //     `adjacent to player ${player.realName}, description ${player.description}`
    //   );
    // });
    return adjPlayerCell;
    // reference to dialog sq that is triggered by E
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

    console.log('activeAdjCells :>> ', activeAdjCells);
    console.log('interactMode :>> ', interactMode);

    // setInteractMode([...interactMode, ...activeAdjCells]);

    activeAdjCells.forEach((cell) => {
      console.log(`${cell.userObj.realName}: \n${cell.title}\n${cell.url}`);
      // window.open(cell.url);
    });
  };
  const handleInteractKey = () => {
    if (userSquare.current && userSquare.current.style && userSquare.current.style.visibility) {
      const userSqDisplay = userSquare.current.style.visibility;
      userSquare.current.style.visibility = userSqDisplay === 'hidden' ? 'visible' : 'hidden';
      // openInteractiveObj();
      // interactWPlayer();
      const adjPlayers = adjPlayersNotSelf();
      const adjActiveObjs = getActiveAdjCells();
      console.log('adjActiveObjs:');
      console.log(adjActiveObjs);

      setInteractMode([...interactMode, ...adjPlayers, ...adjActiveObjs]);

      setModalDisplay('interact');
    }
  };
  const handleBuildKey = () => {
    if (userSquare.current && userSquare.current.style && userSquare.current.style.visibility) {
      const userSqDisplay = userSquare.current.style.visibility;
      userSquare.current.style.visibility = userSqDisplay === 'hidden' ? 'visible' : 'hidden';
      setModalDisplay('build');
    }
  };
  const handlePlayersPositions = (playerPos) => {
    console.log('handling playing positions');
    // remove existing copy
    // if (userObj.realName !== '') {
    //   playerPos = playerPos.map((row) =>
    //     row.map((cell) => (cell !== null && cell.id === userId ? null : cell))
    //   );
    //   const { x, y } = userPosition;
    //   console.log('userObj :>> ', userObj);
    //   playerPos[y][x] = userObj;
    // }

    setPlayersPositions(playerPos);
  };

  // ======================END OF FUNCTIONS===============================
  useEffect(() => {
    axios
      .get(`/user/${userId}`)
      .then((response) => {
        const user = response.data;
        const { realName, description, username } = user;
        setUserObj(user);
        // SOCKETS
        console.log('user :>> ', user);
        console.log('userPosition :>> ', userPosition);
        socket.emit('grid:join', {
          userId,
          realName,
          username,
          description,
          worldId,
          userPosition,
        });
      })
      .catch((e) => {
        console.log('error in getting user', e);
      });
  }, []);

  useEffect(() => {
    console.log('in use effect key press handler');
    // KEY PRESSES
    const handleKeyPress = (e) => {
      if (!isChatFocused && !isInputTxtFocused) {
        if (Object.keys(directionalKeys).includes(e.code)) {
          handleDirKeys(e.code);
          // TODO FIGURE OUT INTERACT MODE
          setInteractMode([]);
          setModalDisplay(null);
          if (buildTool.tool !== '') {
            setBuildTool({
              flag: false,
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
      user: userObj,
      x: userPosition.x,
      y: userPosition.y,
    });

    socket.on('PLAYER_POSITIONS', handlePlayersPositions);

    return () => {
      socket.off('PLAYER_POSITIONS', handlePlayersPositions);
    };
  }, [socket, userPosition]);
  useEffect(() => {
    console.log('activeObjCells :>> ', world.worldState.activeObjCells);
    setActiveCells([...world.worldState.activeObjCells]);
  }, [socket, world]);
  return (
    <>
      <GridSquares
        id="gridSquares"
        activeCells={activeCells}
        playersPositions={playersPositions}
        userSquare={userSquare}
        userObj={userObj}
        world={world}
        setWorld={setWorld}
        buildTool={buildTool}
        setBuildTool={setBuildTool}
        setInputTxtFocused={setInputTxtFocused}
        interactMode={interactMode}
        modalDisplay={modalDisplay}
      />
    </>
  );
}
