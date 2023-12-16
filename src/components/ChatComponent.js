import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const ChatComponent = () => {
  const [socket, setSocket] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const newSocket = io('http://localhost:3000', {
      withCredentials: true,
      extraHeaders: {
        'my-custom-header': 'value',
      },
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('chat message', (msg) => {
        console.log('Получено сообщение из чата:', msg);
        setChatMessages((prevMessages) => [...prevMessages, msg]);
      });
      socket.on('clear chat', () => {
        console.log('История чата была очищена');
        setChatMessages([]);
      });
    }
  }, [socket]);

  const handleSendMessage = () => {
    if (socket && newMessage.trim() !== '') {
      socket.emit('chat message', newMessage);
      setNewMessage('');
    }
  };

  const handleClearChat = () => {
    if (socket) {
      socket.emit('clear chat');
    }
  };

  return (
    <div className="chat-container">
      <h3>Чат</h3>
      <div className="chat-messages">
        {chatMessages.map((message, index) => (
          <div key={index} className="chat-message">
            {message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Отправить</button>
      <button onClick={handleClearChat}>Очистить чат</button>
    </div>
  );
};

export default ChatComponent;
