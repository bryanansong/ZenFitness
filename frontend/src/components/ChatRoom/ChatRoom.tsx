import React, { useState, useEffect, useRef } from "react";
import Message from "../Message/Message";
import MessageInput from "../MessageInput/MessageInput";
import styles from "./ChatRoom.module.css";
import { io, Socket } from "socket.io-client";

interface ChatRoomProps {
  chatId: number;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ chatId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_BACKEND_URL);

    socketRef.current.emit("join_chat", chatId);

    socketRef.current.on("receive_message", handleReceiveMessage);

    fetchMessages();

    return () => {
      if (socketRef.current) {
        socketRef.current.off("receive_message");
        socketRef.current.emit("leave_chat", chatId);
        socketRef.current.disconnect();
      }
    };
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/messages/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        setOtherUser(data.otherUser);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleReceiveMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleSendMessage = (content: string) => {
    const newMessage: Partial<Message> = {
      senderId: parseInt(localStorage.getItem("userId") || "0"),
      content,
      timestamp: new Date().toISOString(),
    };
    socketRef.current?.emit("send_message", { chatId, message: newMessage });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.chatRoom}>
      <div className={styles.header}>
        <h2>{otherUser?.username}</h2>
      </div>
      <div className={styles.messageList}>
        {messages.map((message, index) => (
          <Message
            key={index}
            message={message}
            isOwnMessage={
              message.senderId ===
              parseInt(localStorage.getItem("userId") || "0")
            }
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatRoom;
