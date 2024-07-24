import React from "react";
import styles from "./Message.module.css";

interface MessageProps {
  message: Message;
  isOwnMessage: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isOwnMessage }) => {
  return (
    <div
      className={`${styles.message} ${
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      }`}
    >
      <div className={styles.content}>{message.content}</div>
      <div className={styles.timestamp}>
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
};

export default Message;
