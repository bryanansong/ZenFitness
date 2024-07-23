import React, { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationAsRead,
} from "../../api/notifications";
import styles from "./NotificationsList.module.css";
import { toast } from "react-toastify";
import Loader from "../../screens/Loader/Loader";

const NotificationsList: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const fetchedNotifications = await getNotifications();
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const res = await markNotificationAsRead(notificationId);
      setNotifications(
        notifications.map((notif) =>
          notif.id === notificationId ? { ...notif, status: "read" } : notif
        )
      );
      toast(res.message);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className={styles.notificationsContainer}>
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul className={styles.notificationsList}>
          {notifications.map((notification) => (
            <li key={notification.id} className={styles.notificationItem}>
              <p>{notification.content}</p>
              <small>{new Date(notification.createdAt).toLocaleString()}</small>
              {notification.status !== "read" && (
                <button onClick={() => handleMarkAsRead(notification.id)}>
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsList;
