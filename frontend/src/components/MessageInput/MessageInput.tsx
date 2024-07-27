import React, { useState } from "react";
import styles from "./MessageInput.module.css";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form className={styles.inputForm} onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className={styles.input}
      />
      <button type="submit" className={styles.sendButton}>
        Send
      </button>
    </form>
  );
};

export default MessageInput;
