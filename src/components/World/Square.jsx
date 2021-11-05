import React from 'react';
import { updateWorldInDb } from './axiosRequests.jsx';
import { rowFromIndex, colFromIndex } from './GridConstants.mjs';
import UserModal from './UserModal.jsx';

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

const buildOnCell = (index, world, setWorld, buildTool, socket) => {
  const row = rowFromIndex(index);
  const col = colFromIndex(index);
  const { board } = world.worldState;
  if (buildTool.tool === 'wall') {
    world.worldState.board[row][col] = {
      ...board[row][col],
      color: buildTool.color,
    };
    world.worldState.board = board;
    // why not working?

    console.log('world.worldStates going into db :>> ', world);
    updateWorldInDb(world.id, world.worldState);
    socket.emit('grid:update:world', { worldId: world.id });

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

export default function Square({
  player,
  index,
  userId,
  userSquare,
  world,
  setWorld,
  buildTool,
  setBuildTool,
  socket,
}) {
  const buildToolType = buildTool.type;
  // need to get x and y coordinate to update world board
  let fill = (
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
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
              buildOnCell(index, world, setWorld, buildTool, socket);
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
              buildOnCell(index, world, setWorld, buildTool, socket);
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
}
