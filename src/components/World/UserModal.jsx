/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import '../../styles.scss';
import 'tailwindcss/tailwind.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChessRook,
  faStickyNote,
  faThLarge,
  faIcons,
  faTimes,
  faFont,
} from '@fortawesome/free-solid-svg-icons';
import {
  hexPalette,
  tailWindCol400,
  tailWindCol200,
} from './GridConstants.mjs';

const WallTool = ({ toolSetting, setToolSetting }) => (
  <div>
    <button
      className="h-12 w-12 border-1 m-2"
      type="button"
      onClick={() => {
        // open wall palette
        console.log('click on walltool');

        setToolSetting({ ...toolSetting, tool: 'wall' });
      }}
    >
      <FontAwesomeIcon
        className="text-3xl m-2 text-purple-700"
        icon={faChessRook}
      />
    </button>
    Wall
  </div>
);
const RoomTool = ({ toolSetting, setToolSetting }) => (
  <div>
    <button
      className="h-12 w-12 border-1 m-2"
      type="button"
      onClick={() => {
        setToolSetting({ ...toolSetting, tool: 'room' });
      }}
    >
      <FontAwesomeIcon
        className="text-3xl  m-2 text-red-200"
        icon={faThLarge}
      />
    </button>
    Room
  </div>
);
const CharFiller = ({ toolSetting, setToolSetting }) => (
  <div>
    <button
      className="h-12 w-12 border-1 m-2"
      type="button"
      onClick={() => {
        setToolSetting({ ...toolSetting, tool: 'charFill' });
      }}
    >
      <FontAwesomeIcon
        className="text-3xl  m-2 text-green-700"
        icon={faIcons}
      />
    </button>
    Char
  </div>
);
const WidgetTool = ({ toolSetting, setToolSetting }) => (
  <div>
    <button
      className="h-12 w-12 border-1 m-2 "
      type="button"
      onClick={() => {
        setToolSetting({ ...toolSetting, tool: 'widget' });
      }}
    >
      <FontAwesomeIcon
        className="text-3xl m-2 text-yellow-400"
        icon={faStickyNote}
      />
    </button>
    Widget
  </div>
);
const ToolsModal = ({
  toolSetting,
  setToolSetting,
  setBuildTool,
  modalRef,
}) => {
  const placement = 'top';
  return (
    <div
      ref={modalRef}
      className="p-2 max-w-sm mx-auto bg-white rounded-xl shadow-md  items-center space-x-4 z-10"
    >
      <div className="flex">
        <WallTool toolSetting={toolSetting} setToolSetting={setToolSetting} />
        <RoomTool toolSetting={toolSetting} setToolSetting={setToolSetting} />
        <CharFiller toolSetting={toolSetting} setToolSetting={setToolSetting} />
        <WidgetTool toolSetting={toolSetting} setToolSetting={setToolSetting} />
        <CloseButton
          setBuildTool={setBuildTool}
          setToolSetting={setToolSetting}
          modalRef={modalRef}
        />
      </div>
    </div>
  );
};

const ColorButton = ({ color, toolSetting, setToolSetting, setBuildTool }) => (
  // eslint-disable-next-line jsx-a11y/control-has-associated-label
  <button
    className="h-12 w-12 border-1 m-2"
    type="button"
    onClick={() => {
      setBuildTool({ ...toolSetting, color });
    }}
    style={{ backgroundColor: color }}
  />
);
const CloseButton = ({ setBuildTool, setToolSetting, modalRef }) => (
  // eslint-disable-next-line jsx-a11y/control-has-associated-label
  <button
    className="h-12 w-12 border-2 m-2"
    type="button"
    onClick={() => {
      modalRef.current.style.display = 'none';
      setBuildTool({ tool: '' });
      setToolSetting({ tool: '' });
    }}
  >
    <FontAwesomeIcon className="text-3xl m-2 text-gray-500" icon={faTimes} />
  </button>
);
const WallPalette = ({
  toolSetting,
  setToolSetting,
  setBuildTool,
  modalRef,
}) => {
  const colors = tailWindCol400;
  const colorButtons = colors.map((color, i) => (
    <ColorButton
      key={`col_${i.toString()}`}
      color={color}
      toolSetting={toolSetting}
      setToolSetting={setToolSetting}
      setBuildTool={setBuildTool}
    />
  ));
  return (
    <div
      ref={modalRef}
      className="p-2  mx-auto bg-white rounded-xl shadow-md  items-center space-x-4 z-10 flex"
    >
      {colorButtons}
      <CloseButton
        setBuildTool={setBuildTool}
        setToolSetting={setToolSetting}
        modalRef={modalRef}
      />
    </div>
  );
};

const CharFillForm = ({
  toolSetting,
  setToolSetting,
  setBuildTool,
  modalRef,
  setInputTxtFocused,
}) => {
  const colors = tailWindCol400;

  return (
    <div
      ref={modalRef}
      className="p-2  mx-auto bg-white rounded-xl shadow-md  items-center space-x-4 z-10 flex"
    >
      <p>
        <FontAwesomeIcon className="text-3xl m-2 text-gray-600" icon={faFont} />
      </p>
      <input
        type="text"
        maxLength="2"
        className="appearance-none bg-transparent border-b-2 w-12 text-2xl border-gray-500 text-gray-900 mr-3 py-1 px-2 mx-2 leading-tight focus:outline-none text-center font-semibold"
        onFocus={() => {
          console.log('infocus');
          setInputTxtFocused(true);
        }}
        onBlur={() => {
          console.log('outof focus');
          setInputTxtFocused(false);
        }}
        onChange={(e) => {
          e.preventDefault();
          console.log('e.target.value :>> ', e.target.value);
          setBuildTool({ ...toolSetting, charFill: e.target.value });
        }}
      />
      <CloseButton
        setBuildTool={setBuildTool}
        setToolSetting={setToolSetting}
        modalRef={modalRef}
      />
    </div>
  );
};
const Modal = ({
  toolSetting,
  setToolSetting,
  setBuildTool,
  setInputTxtFocused,
}) => {
  // when tool change, rerun happens
  const modalRef = useRef(null);
  let elem = <></>;
  const currentTool = toolSetting.tool;
  if (currentTool === '') {
    elem = (
      <ToolsModal
        setBuildTool={setBuildTool}
        toolSetting={toolSetting}
        setToolSetting={setToolSetting}
        modalRef={modalRef}
      />
    );
  } else if (currentTool === 'wall') {
    elem = (
      <WallPalette
        setBuildTool={setBuildTool}
        toolSetting={toolSetting}
        setToolSetting={setToolSetting}
        b
        modalRef={modalRef}
      />
    );
  } else if (currentTool === 'charFill') {
    console.log('charfill tool');
    elem = (
      <CharFillForm
        setBuildTool={setBuildTool}
        toolSetting={toolSetting}
        setToolSetting={setToolSetting}
        modalRef={modalRef}
        setInputTxtFocused={setInputTxtFocused}
      />
    );
  } else if (currentTool === 'widget') {
    console.log('widget tool');
    elem = <></>;
  }

  return elem;
};

export default function UserModal({ setBuildTool, setInputTxtFocused }) {
  const [toolSetting, setToolSetting] = useState({
    tool: '',
    color: '',
    roomId: 0,
    charFill: '',
    activeObjType: '',
    url: '',
  });
  return (
    <div
      className="translate-y-16"
      style={{
        display: 'none',
        position: 'absolute',
        top: '-200%',
      }}
    >
      <Modal
        setBuildTool={setBuildTool}
        toolSetting={toolSetting}
        setToolSetting={setToolSetting}
        setInputTxtFocused={setInputTxtFocused}
      />
    </div>
  );
}
