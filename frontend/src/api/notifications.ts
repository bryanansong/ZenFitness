export const getNotifications = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/notifications`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((res) => res.json());
    return response;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: number) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/notifications/${notificationId}/read`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((res) => res.json());
    return response;
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    throw error;
  }
};
