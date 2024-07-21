import { prisma } from "../utils/helpers.js";

const getNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const notifications = await prisma.notification.findMany({
      where: { userId, status: "sent" },
      orderBy: { createdAt: "desc" },
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
}

const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.userId;

    const updatedNotification = await prisma.notification.updateMany({
      where: { id: parseInt(notificationId), userId },
      data: { status: "read" },
    });

    if (updatedNotification.count === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update notification" });
  }
}

export {
  getNotifications,
  markNotificationAsRead,
};
