import React from 'react';
import { Card } from 'react-bootstrap';
import '../../styles.scss';
import 'tailwindcss/tailwind.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faFillDrip,
  faChessRook,
  faStickyNote,
  faThLarge,
  faIcons,
} from '@fortawesome/free-solid-svg-icons';

const WallTool = () => (
  <div>
    <button className="h-12 w-12 border-1 m-2">
      <FontAwesomeIcon
        className="text-3xl m-2 text-purple-700"
        icon={faChessRook}
      />
    </button>
    Wall
  </div>
);
const RoomTool = () => (
  <div>
    <button className="h-12 w-12 border-1 m-2">
      <FontAwesomeIcon
        className="text-3xl  m-2 text-red-200"
        icon={faThLarge}
      />
    </button>
    Room
  </div>
);
const CharFiller = () => (
  <div>
    <button className="h-12 w-12 border-1 m-2">
      <FontAwesomeIcon
        className="text-3xl  m-2 text-green-700"
        w
        icon={faIcons}
      />
    </button>
    Char
  </div>
);
const WidgetTool = () => (
  <div>
    <button className="h-12 w-12 border-1 m-2 ">
      <FontAwesomeIcon
        className="text-3xl m-2 text-yellow-400"
        icon={faStickyNote}
      />
    </button>
    Widget
  </div>
);
const ToolsModal = () => {
  const placement = 'top';
  return (
    <div className="p-4 max-w-sm mx-auto bg-white rounded-xl shadow-md  items-center space-x-4z-10">
      <div className="flex">
        <WallTool />
        <RoomTool />
        <CharFiller />
        <WidgetTool />
      </div>
    </div>
  );
};

export default function UserModal(userSquare) {
  const lalala = 5;
  console.log('userSquare in tools :>> ', userSquare);
  return (
    <div
      className="translate-y-16"
      style={{
        display: 'none',
        position: 'absolute',
        top: '-300%',
      }}
    >
      <ToolsModal />
    </div>
  );
}
