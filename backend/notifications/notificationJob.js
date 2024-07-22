import { schedule } from "node-cron";
import { prisma } from "../utils/helpers.js";
import { generateAllNotifications } from "./notificationGenerator.js";
import { evaluateDecisionTree } from "./decisionTreeEvaluator.js";

const processUserNotifications = async (userId, io) => {
  const userInterest = await prisma.userInterest.findUnique({
    where: { userId },
    include: { interests: true },
  });

  if (!userInterest) return;

  const generatedNotifications = await generateAllNotifications(userId);

  for (const notification of generatedNotifications) {
    await prisma.notification.create({
      data: {
        userId,
        type: notification.type,
        content: notification.content,
        status: "unsent",
      },
    });
  }

  const unsentNotifications = await prisma.notification.findMany({
    where: { userId, status: "unsent" },
  });

  const selectedNotification = evaluateDecisionTree(
    userInterest,
    unsentNotifications
  );

  if (selectedNotification) {
    const updatedNotification = await prisma.notification.update({
      where: { id: selectedNotification.id },
      data: { status: "sent", deliveredAt: new Date() },
    });

    // Send notification via Socket.io
    io.to(userId.toString()).emit("notification", updatedNotification);
  }
};

const scheduleNotificationJob = (io) => {
  schedule("0 10 * * *", async () => {
    const users = await prisma.user.findMany();

    for (const user of users) {
      await processUserNotifications(user.id, io);
    }
  });
};

export { scheduleNotificationJob };
