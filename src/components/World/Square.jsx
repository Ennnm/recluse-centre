/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from 'react';
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

const buildOnCell = (index, world, setWorld, buildTool, socket) => {
  const row = rowFromIndex(index);
  const col = colFromIndex(index);

  const { board } = world.worldState;
  console.log(
    'world.worldState.board[row][col] :>> before ',
    world.worldState.board[row][col]
  );
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
    console.log(
      'world.worldState.board[row][col] :>> ',
      world.worldState.board[row][col]
    );
  } else if (buildTool.tool === 'url') {
    // add to active cell not here
    const activeObj = new ActiveObj(col, row, buildTool.url);
    world.worldState.activeObjCells.push(activeObj);
  } else if (buildTool.tool === 'removeUrl') {
    console.log('remove url');
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
  activeCells,
  setActiveCells,
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
}) => (
  <input
    className="cell gridBorder"
    type="image"
    src={faviconFromSite(obj.url)}
    // src={iconFromObjType(obj)}
    onClick={() => {
      if (buildToolType === '') {
        clickOnCell(obj);
      } else {
        buildOnCell(index, world, setWorld, buildTool, socket);
      }
    }}
    key={`active${index}`}
    alt={obj.type}
  />
);
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
  activeCells,
  setActiveCells,
}) => (
  <input
    onClick={() => {
      if (buildToolType === '' || buildToolType !== undefined) {
        clickOnPlayer(player);
      } else {
        buildOnCell(
          index,
          world,
          setWorld,
          buildTool,
          socket,
          activeCells,
          setActiveCells
        );
      }
    }}
    type="image"
    className="cell gridBorder"
    src={`https://avatars.dicebear.com/api/big-smile/${player + 1}.svg`}
    alt="profile pic"
  />
);

export default function Square({
  player,
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
  if (player !== null) {
    if (typeof player === 'object') {
      fill = (
        <ObjectSquare
          obj={player}
          index={index}
          world={world}
          setWorld={setWorld}
          buildTool={buildTool}
          buildToolType={buildToolType}
          socket={socket}
        />
      );
    } else if (player === userId) {
      fill = (
        <UserSquare
          buildToolType={buildToolType}
          userSquare={userSquare}
          player={player}
          setBuildTool={setBuildTool}
          setInputTxtFocused={setInputTxtFocused}
        />
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      );
    } else {
      fill = (
        <PlayerSquare
          buildToolType={buildToolType}
          player={player}
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
