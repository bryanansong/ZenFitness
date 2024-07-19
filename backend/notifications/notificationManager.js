import { prisma } from "../utils/helpers.js";

const selectAndSendNotifications = async () => {
  const users = await prisma.user.findMany();

  for (const user of users) {
    const recentNotifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        sentAt: null,
      },
      orderBy: { importance: "desc" },
    });

    if (recentNotifications.length > 0) {
      const topNotification = recentNotifications[0];
      await prisma.notification.update({
        where: { id: topNotification.id },
        data: { sentAt: new Date() },
      });

      // TODO Send notification
    }
  }
};

export { selectAndSendNotifications };
