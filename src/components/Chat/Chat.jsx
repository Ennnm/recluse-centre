/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

export default function Chat({
  socket, username, userId, realName, room, handleChatFocused, handleChatUnfocused,
}) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [showChatBody, setShowChatBody] = useState(false);

  useEffect(() => {
    socket.emit('chat:join', room);
    socket.on('chat:receive', (data) => {
      // set message list when RECEIVING a message
      setMessageList((list) => [...list, data]);
      console.log('message received!');
      console.log(data);
    });
  }, [socket]);

  const sendMessage = async () => {
    if (currentMessage.trim() !== '') {
      const hour = new Date(Date.now()).getHours();
      const min = new Date(Date.now()).getMinutes();
      const hourFmt = (hour.toString().length === 1 ? `0${hour}` : `${hour}`);
      const minFmt = (min.toString().length === 1 ? `0${min}` : `${min}`);
      const messageData = {
        room,
        username,
        userId,
        realName,
        message: currentMessage,
        time: `${hourFmt}:${minFmt}`,
        context: 'message',
      };

      await socket.emit('chat:send', messageData);
      // set message list also when we SEND / EMIT our own message
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage('');
      setShowChatBody(true);
    }
  };

  const handleShowChatBody = () => {
    setShowChatBody(!showChatBody);
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
      <div className={`chat-body${showChatBody ? '' : ' d-none'}`}>
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => (
            <div className="message">
              <div>
                <div className="message-content">
                  <p className="text-xs">
                    <strong className={(userId === messageContent.userId ? 'text-yellow-200' : 'text-white')}>
                      {messageContent.realName}
                      {' '}
                      &lt;
                      {messageContent.username}
                      &gt;:
                    </strong>
                    {' '}
                    <span className={(userId === messageContent.userId ? 'text-yellow-100' : 'text-gray-200')}>{messageContent.message}</span>
                    {' '}
                    <em className={(userId === messageContent.userId ? 'text-yellow-100' : 'text-gray-200')}>
                      [
                      {messageContent.time}
                      ]
                    </em>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input type="text" className="chat-input" placeholder="Hey..." maxLength="640" value={currentMessage} onChange={handleCurrentMessageChange} onKeyPress={handleCurrentMessageKeyPress} onFocus={handleChatFocused} onBlur={handleChatUnfocused} />
        <button type="button" className="chat-submit-button" onClick={sendMessage}>
          &#x27A4;
        </button>
        <button type="button" className="chat-expand-button" onClick={handleShowChatBody}>
          {(showChatBody ? (<span>&#9660;</span>) : (<span>&#9650;</span>))}
        </button>
      </div>
    </div>
  );
}
