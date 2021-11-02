import React, { useState, useEffect } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

export default function Chat({
  // eslint-disable-next-line react/prop-types
  socket, username, room, handleChatFocused, handleChatUnfocused,
}) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react/prop-types
    socket.emit('chat:join', room);
    // eslint-disable-next-line react/prop-types
    socket.on('chat:receive', (data) => {
      // set message list when RECEIVING a message
      setMessageList((list) => [...list, data]);
      console.log('message received!');
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
      // set message list also when we SEND / EMIT our own message
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage('');
    }
  };

  const handleCurrentMessageChange = (event) => {
    setCurrentMessage(event.target.value);
  };

  const handleCurrentMessageKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => (
            <div className="message" id={(username === messageContent.author ? 'you' : 'other')}>
              <div>
                <div className="message-content">
                  <p>
                    {messageContent.message}
                  </p>
                </div>
                <div className="message-meta">
                  <p id="time">{messageContent.time}</p>
                  <p id="author">{messageContent.author}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input type="text" placeholder="Hey..." value={currentMessage} onChange={handleCurrentMessageChange} onKeyPress={handleCurrentMessageKeyPress} onFocus={handleChatFocused} onBlur={handleChatUnfocused} />
        <button type="button" onClick={sendMessage}>
          &#9658;
        </button>
      </div>
    </div>
  );
}
