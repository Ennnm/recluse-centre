/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStickyNote } from '@fortawesome/free-solid-svg-icons';

export default function DialogModal({ userSquare }) {
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
      className="translate-y-16 "
      ref={userSquare}
      style={{
        // display: 'none',
        visibility: 'hidden',
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
