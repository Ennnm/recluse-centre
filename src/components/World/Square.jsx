/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useRef } from 'react';
import { updateWorldInDb } from './axiosRequests.mjs';
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

const clickOnActive = (player) => {
  console.log(
    `This is player ${player.id}: ${player.realName}\nDescription: ${player.description}`
  );
};

const buildOnCell = (index, world, setWorld, buildTool, socket, userObj) => {
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
      const activeObj = new ActiveObj(
        col,
        row,
        buildTool.url,
        userObj,
        buildTool.title
      );
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
  userObj,
}) => (
  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
  <div
    className="cell gridBorder"
    onClick={() => {
      if (buildToolType !== '') {
        buildOnCell(index, world, setWorld, buildTool, socket, userObj);
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
  userObj,
  userSquare,
}) => {
  console.log('rendering objsq');

  return (
    <input
      className="cell gridBorder"
      type="image"
      src={faviconFromSite(obj.url)}
      onClick={() => {
        if (buildToolType === '') {
          clickOnCell(obj);
        } else {
          buildOnCell(index, world, setWorld, buildTool, socket, userObj);
        }
      }}
      key={`active${index}`}
      alt={obj.type}
    />
  );
};

const NameTag = ({ name }) => (
  <div
    className="absolute  z-10 font-sans font-semibold bg-gray-300 px-2 rounded-full border-2"
    style={{
      top: '100%',
      left: '50%',
      transform: 'translate(-50%, 0%)',
      // backgroundColor: '#58566f',
    }}
  >
    {name}
  </div>
);
const PlayerSquare = ({
  clientId,
  userSquare,
  player,
  buildTool,
  setBuildTool,
  setInputTxtFocused,
  interactMode,
  modalDisplay,
}) => (
  // eslint-disable-next-line jsx-a11y/no-static-element-interactions

  <div
    onClick={() => {
      if (buildTool.type === '') {
        clickOnActive(player);
      }
    }}
    type="image"
    className="cell gridBorder"
    style={{
      backgroundImage: `url("https://avatars.dicebear.com/api/big-smile/${
        player.id + 1
      }.svg")`,
      cursor: 'pointer',
      position: 'relative',
    }}
  >
    {clientId === player.id && (
      <UserModal
        buildTool={buildTool}
        userSquare={userSquare}
        setBuildTool={setBuildTool}
        setInputTxtFocused={setInputTxtFocused}
        interactMode={interactMode}
        modalDisplay={modalDisplay}
      />
    )}
    <NameTag name={player.realName} />
  </div>
);
export default function Square({
  actObj,
  index,
  userObj,
  userSquare,
  world,
  setWorld,
  buildTool,
  setBuildTool,
  setInputTxtFocused,
  interactMode,
  modalDisplay,
}) {
  const buildToolType = buildTool.tool;
  const socket = useContext(SocketContext);

  // need to get x and y coordinate to update world board
  let fill = (
    <BlankSquare
      index={index}
      world={world}
      userObj={userObj}
      setWorld={setWorld}
      buildTool={buildTool}
      buildToolType={buildToolType}
      socket={socket}
      interactMode={interactMode}
    />
  );
  if (actObj !== null && actObj !== undefined) {
    if ('url' in actObj) {
      fill = (
        <ObjectSquare
          obj={actObj}
          index={index}
          world={world}
          userObj={userObj}
          setWorld={setWorld}
          buildTool={buildTool}
          buildToolType={buildToolType}
          socket={socket}
          interactMode={interactMode}
          userSquare={userSquare}
        />
      );
    } else {
      fill = (
        <PlayerSquare
          clientId={userObj.id}
          buildTool={buildTool}
          userSquare={userSquare}
          player={actObj}
          setBuildTool={setBuildTool}
          setInputTxtFocused={setInputTxtFocused}
          userObj={userObj}
          interactMode={interactMode}
          modalDisplay={modalDisplay}
        />
      );
    }
  }
  return fill;
}
