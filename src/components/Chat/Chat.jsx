import React, { useState, useEffect } from 'react';

// eslint-disable-next-line react/prop-types
export default function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react/prop-types
    socket.on('chat:receive', (data) => {
      console.log(data);
    });
  }, [socket]);

  const sendMessage = async () => {
    if (currentMessage.trim() !== '') {
      const messageData = {
        room,
        author: username,
        message: currentMessage,
        time: `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`,
      };

      // eslint-disable-next-line react/prop-types
      await socket.emit('chat:send', messageData);
    }
  };

  const handleCurrentMessageChange = (event) => {
    setCurrentMessage(event.target.value);
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body" />
      <div className="chat-footer">
        <input type="text" placeholder="Hey..." value={currentMessage} onChange={handleCurrentMessageChange} />
        <button type="button" onClick={sendMessage}>
          &#9658;
        </button>
      </div>
    </div>
  );
}
