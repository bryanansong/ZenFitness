import React from "react";
import NotificationsList from "../../components/NotificationsList/NotificationsList";
import styles from "./Notifications.module.css";

const Notifications: React.FC = () => {
  return (
    <div className={styles.notificationsScreen}>
      <NotificationsList />
    </div>
  );
};

export default Notifications;
