/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useRef } from 'react';
import { updateWorldInDb } from './axiosRequests.jsx';
import {
  rowFromIndex,
  colFromIndex,
  faviconFromSite,
  ActiveObj,
} from './utils.mjs';
import UserModal from './UserModal.jsx';
import { SocketContext } from '../../contexts/sockets.mjs';

const clickOnCell = (obj) => {
  window.open(obj.url);
};

const clickOnPlayer = (player) => {
  console.log(`This is player ${player}`);
};

const buildOnCell = (
  index,
  world,
  setWorld,
  buildTool,
  socket,
  objToDelete = null
) => {
  const row = rowFromIndex(index);
  const col = colFromIndex(index);

  const { board } = world.worldState;
  if (buildTool.tool === 'wall') {
    world.worldState.board[row][col] = {
      ...board[row][col],
      color: buildTool.color,
    };
  } else if (buildTool.tool === 'charFill') {
    world.worldState.board[row][col] = {
      ...board[row][col],
      charFill: buildTool.charFill,
    };
  } else if (buildTool.tool === 'url') {
    // add to active cell not here
    if (buildTool.url.length > 0) {
      const activeObj = new ActiveObj(col, row, buildTool.url, buildTool.title);
      world.worldState.activeObjCells.push(activeObj);
    }
  } else if (buildTool.tool === 'erase') {
    world.worldState.board[row][col] = null;
    const filterActiveObj = world.worldState.activeObjCells.filter((obj) => {
      if (obj.x === col && obj.y === row) {
        return false;
      }
      return true;
    });
    world.worldState.activeObjCells = filterActiveObj;
    if (objToDelete !== null) {
      // objToDelete.current.style.visibility = 'hidden';
      objToDelete.current.key = Date.now();
      console.log('objToDelete.current.key :>> ', objToDelete.current.key);
    }
  }

  updateWorldInDb(world.id, world.worldState);
  socket.emit('grid:update:world', { worldId: world.id });
  setWorld({ ...world });
};
const BlankSquare = ({
  index,
  world,
  setWorld,
  buildTool,
  buildToolType,
  socket,
}) => (
  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
  <div
    className="cell gridBorder"
    onClick={() => {
      if (buildToolType !== '') {
        buildOnCell(index, world, setWorld, buildTool, socket);
      }
    }}
  />
);
const ObjectSquare = ({
  obj,
  index,
  world,
  setWorld,
  buildTool,
  buildToolType,
  socket,
}) => {
  console.log('rendering objsq');
  const objToDelete = useRef(null);
  return (
    <input
      ref={objToDelete}
      className="cell gridBorder"
      type="image"
      src={faviconFromSite(obj.url)}
      onClick={() => {
        if (buildToolType === '') {
          clickOnCell(obj);
        } else {
          buildOnCell(index, world, setWorld, buildTool, socket, objToDelete);
        }
      }}
      key={`active${index}`}
      alt={obj.type}
    />
  );
};
const UserSquare = ({
  buildToolType,
  userSquare,
  player,
  setBuildTool,
  setInputTxtFocused,
}) => (
  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
  <div
    onClick={() => {
      if (buildToolType === '') {
        clickOnPlayer(player);
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
    <UserModal
      userSquare={userSquare}
      setBuildTool={setBuildTool}
      setInputTxtFocused={setInputTxtFocused}
    />
  </div>
);
const PlayerSquare = ({
  buildToolType,
  player,
  index,
  world,
  setWorld,
  buildTool,
  socket,
}) => (
  <input
    onClick={() => {
      if (buildToolType === '' || buildToolType !== undefined) {
        clickOnPlayer(player);
      } else {
        buildOnCell(index, world, setWorld, buildTool, socket);
      }
    }}
    type="image"
    className="cell gridBorder"
    src={`https://avatars.dicebear.com/api/big-smile/${player + 1}.svg`}
    alt="profile pic"
  />
);

export default function Square({
  actObj,
  index,
  userId,
  userSquare,
  world,
  setWorld,
  buildTool,
  setBuildTool,
  setInputTxtFocused,
}) {
  const buildToolType = buildTool.tool;
  const socket = useContext(SocketContext);

  // need to get x and y coordinate to update world board
  let fill = (
    <BlankSquare
      index={index}
      world={world}
      setWorld={setWorld}
      buildTool={buildTool}
      buildToolType={buildToolType}
      socket={socket}
    />
  );
  if (actObj !== null) {
    if (typeof actObj === 'object') {
      fill = (
        <ObjectSquare
          obj={actObj}
          index={index}
          world={world}
          setWorld={setWorld}
          buildTool={buildTool}
          buildToolType={buildToolType}
          socket={socket}
        />
      );
    } else if (actObj === userId) {
      fill = (
        <UserSquare
          buildToolType={buildToolType}
          userSquare={userSquare}
          player={actObj}
          setBuildTool={setBuildTool}
          setInputTxtFocused={setInputTxtFocused}
        />
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      );
    } else {
      fill = (
        <PlayerSquare
          buildToolType={buildToolType}
          player={actObj}
          index={index}
          world={world}
          setWorld={setWorld}
          buildTool={buildTool}
          socket={socket}
        />
      );
    }
  }

  return fill;
}
