import React, { useState, useEffect } from "react";
import ChatList from "../../components/ChatList/ChatList";
import ChatRoom from "../../components/ChatRoom/ChatRoom";
import styles from "./Messages.module.css";
import { io } from "socket.io-client";

const Messages: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BACKEND_URL);
    setSocket(newSocket);

    // Fetch chats
    fetchChats();

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const fetchChats = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/messages/chats`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setChats(data);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  return (
    <div className={styles.messagesContainer}>
      <ChatList
        chats={chats}
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
      />
      {selectedChat ? (
        <ChatRoom chatId={selectedChat} socket={socket} />
      ) : (
        <div className={styles.noChatRoomContainer}>
          <p className={styles.noChatRoomText}>No Chat selected</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
