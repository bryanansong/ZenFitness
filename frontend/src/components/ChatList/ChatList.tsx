import React from "react";
import styles from "./ChatList.module.css";

interface ChatListProps {
  chats: Chat[];
  selectedChat: number | null;
  onSelectChat: (chatId: number) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectedChat,
  onSelectChat,
}) => {
  return (
    <div className={styles.chatList}>
      <h2 className={styles.title}>Chats</h2>
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`${styles.chatItem} ${
            selectedChat === chat.id ? styles.selected : ""
          }`}
          onClick={() => onSelectChat(chat.id)}
        >
          <span className={styles.chatName}>{chat.otherUser.username}</span>
          <span className={styles.lastMessage}>{chat.lastMessage}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
