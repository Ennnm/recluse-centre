/* eslint-disable react/prop-types, react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScrollToBottom from 'react-scroll-to-bottom';

function Message({ userId, messageContent }) {
  if (messageContent.context === 'connected') {
    return (
      <div className="message">
        <div>
          <div className="message-content">
            <p className="text-xs text-green-200">
              <strong>
                {messageContent.realName}
                {' '}
                &lt;
                {messageContent.username}
                &gt;
              </strong>
              {' '}
              <span>is connected!</span>
              {' '}
              <em>
                [
                {messageContent.time}
                ]
              </em>
            </p>
          </div>
        </div>
      </div>
    );
  } if (messageContent.context === 'disconnected') {
    return (
      <div className="message">
        <div>
          <div className="message-content">
            <p className="text-xs text-red-400">
              <strong>
                {messageContent.realName}
                {' '}
                &lt;
                {messageContent.username}
                &gt;
              </strong>
              {' '}
              <span>has been disconnected!</span>
              {' '}
              <em>
                [
                {messageContent.time}
                ]
              </em>
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
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
  );
}

export default function Chat({
  socket, username, userId, realName, room, handleChatFocused, handleChatUnfocused,
}) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [isMessagesLoaded, setIsMessagesLoaded] = useState(false);
  const [showChatBody, setShowChatBody] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    axios
      .get(`/world/${room}/showmessages`)
      .then((response) => {
        if (!response.data.error) {
          let messages = [...response.data.messages];

          messages = messages.map((message) => {
            const date = new Date(message.createdAt);
            const hour = date.getHours();
            const min = date.getMinutes();
            const sec = date.getSeconds();
            const hourFmt = (hour.toString().length === 1 ? `0${hour}` : `${hour}`);
            const minFmt = (min.toString().length === 1 ? `0${min}` : `${min}`);
            const secFmt = (sec.toString().length === 1 ? `0${sec}` : `${sec}`);

            const messageData = {
              room: message.worldId,
              username: message.messageSender.username,
              userId: message.messageSender.id,
              realName: message.messageSender.realName,
              message: message.message,
              time: `${hourFmt}:${minFmt}:${secFmt}`,
              date,
              context: 'message',
            };

            return messageData;
          });

          if (messageList.length > 0) {
            setMessageList((list) => [...messages, ...list]);
          } else {
            setMessageList(messages);
          }
        }

        setIsMessagesLoaded(true);
      })
      .catch((error) => {
        console.log(error);
        setIsMessagesLoaded(true);
      });
  }, []);

  useEffect(() => {
    socket.emit('chat:join', {
      username,
      userId,
      realName,
      room,
    });
    socket.on('chat:receive', (data) => {
      // set message list when RECEIVING a message
      let message = {
        ...data,
      };

      if (message.context === 'connected' || message.context === 'disconnected') {
        const date = new Date(Date.now());
        const hour = date.getHours();
        const min = date.getMinutes();
        const sec = date.getSeconds();
        const hourFmt = (hour.toString().length === 1 ? `0${hour}` : `${hour}`);
        const minFmt = (min.toString().length === 1 ? `0${min}` : `${min}`);
        const secFmt = (sec.toString().length === 1 ? `0${sec}` : `${sec}`);
        message = {
          ...message,
          time: `${hourFmt}:${minFmt}:${secFmt}`,
          date,
        };
      }
      setMessageList((list) => [...list, message]);
    });
  }, [socket]);

  const sendMessage = async () => {
    if (currentMessage.trim() !== '') {
      setIsSendingMessage(true);
      const date = new Date(Date.now());
      const hour = date.getHours();
      const min = date.getMinutes();
      const sec = date.getSeconds();
      const hourFmt = (hour.toString().length === 1 ? `0${hour}` : `${hour}`);
      const minFmt = (min.toString().length === 1 ? `0${min}` : `${min}`);
      const secFmt = (sec.toString().length === 1 ? `0${sec}` : `${sec}`);
      const messageData = {
        room,
        username,
        userId,
        realName,
        message: currentMessage,
        time: `${hourFmt}:${minFmt}:${secFmt}`,
        date,
        context: 'message',
      };

      axios
        .post(`/world/${room}/createmessage`, messageData)
        .then(async (response) => {
          if (!response.data.error) {
            await socket.emit('chat:send', messageData);
            // set message list also when we SEND / EMIT our own message
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage('');
            setShowChatBody(true);
            setIsSendingMessage(false);
          }
        })
        .catch((error) => {
          console.log(error);
          setIsSendingMessage(false);
        });
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

  if (isMessagesLoaded) {
    return (
      <div className="chat-window">
        <div className={`chat-body${showChatBody ? '' : ' d-none'}`}>
          <ScrollToBottom className="message-container">
            {messageList.map((messageContent, index) => (
              <Message userId={userId} messageContent={messageContent} />
            ))}
          </ScrollToBottom>
        </div>
        <div className="chat-footer">
          <input type="text" className="chat-input" placeholder="Hey..." maxLength="640" value={currentMessage} onChange={handleCurrentMessageChange} onKeyPress={handleCurrentMessageKeyPress} onFocus={handleChatFocused} onBlur={handleChatUnfocused} />
          <button type="button" disabled={isSendingMessage} className="chat-submit-button" onClick={sendMessage}>
            &#x27A4;
          </button>
          <button type="button" className="chat-expand-button" onClick={handleShowChatBody}>
            {(showChatBody ? (<span>&#9660;</span>) : (<span>&#9650;</span>))}
          </button>
        </div>
      </div>
    );
  }
  return null;
}
