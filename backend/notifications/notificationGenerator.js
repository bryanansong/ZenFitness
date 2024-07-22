import { prisma } from "../utils/helpers.js";

const generateWorkoutReminder = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { userInterests: true },
  });

  if (!user || !user.userInterests) return null;

  const daysSinceLastWorkout = Math.floor(
    (Date.now() - user.userInterests.lastWorkoutDate.getTime()) /
      (1000 * 3600 * 24)
  );

  if (daysSinceLastWorkout > 3) {
    return {
      type: "workout_reminder",
      content: `It's been ${daysSinceLastWorkout} days since your last workout. Time to get moving!`,
    };
  }
  return null;
};

const generateTemplateRecommendation = async (userId) => {
  const userInterest = await prisma.userInterest.findUnique({
    where: { userId },
    include: { interests: true },
  });

  if (!userInterest || userInterest.interests.length === 0) return null;

  const highestInterest = userInterest.interests.reduce((max, interest) =>
    interest.score > max.score ? interest : max
  );

  if (highestInterest.score > 70) {
    const recommendedTemplate = await prisma.workoutTemplate.findFirst({
      where: {
        isPublic: true,
        exercises: {
          some: {
            exercise: {
              name: { contains: highestInterest.category },
            },
          },
        },
      },
      include: {
        user: true
      }
    });

    if (recommendedTemplate) {
      return {
        type: "template_recommendation",
        content: `Check out this workout template made by @${recommendedTemplate.user.username}: ${recommendedTemplate.name}`,
      };
    }
  }
  return null;
};

const generateAchievementNotification = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { workoutSessions: true },
  });

  if (!user) return null;

  const workoutCount = user.workoutSessions.length;

  if (workoutCount % 10 === 0) {
    return {
      type: "achievement",
      content: `Congratulations! You've completed ${workoutCount.toLocaleString()} workouts. Keep up the great work!`,
    };
  }
  return null;
};

const generateSocialInteractionNotification = async (userId) => {
  const recentFollow = await prisma.follow.findFirst({
    where: { followingId: userId },
    orderBy: { createdAt: "desc" },
    include: { follower: true },
  });

  if (recentFollow) {
    return {
      type: "social_interaction",
      content: `${recentFollow.follower.username} started following you!`,
    };
  }
  return null;
};

const generateProgressUpdate = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { workoutSessions: { orderBy: { date: "desc" }, take: 5 } },
  });

  if (!user || user.workoutSessions.length < 5) return null;

  const averageDuration =
    user.workoutSessions.reduce((sum, session) => sum + session.duration, 0) /
    5;

  return {
    type: "progress_update",
    content: `Great job! Your average workout duration over the last 5 sessions is ${Math.round(
      averageDuration
    )} minutes.`,
  };
};

const generateMotivationalMessage = async (userId) => {
  const userInterest = await prisma.userInterest.findUnique({
    where: { userId },
  });

  if (!userInterest) return null;

  if (userInterest.activityScore < 30) {
    const messages = [
      "Every workout brings you closer to your goals. Let's get started!",
      "Small steps lead to big changes. How about a quick workout today?",
      "You've got this! Even a short workout can make a big difference.",
    ];
    return {
      type: "motivation",
      content: messages[Math.floor(Math.random() * messages.length)],
    };
  }
  return null;
};

const generateAllNotifications = async (userId) => {
  const notifications = [
    await generateWorkoutReminder(userId),
    await generateTemplateRecommendation(userId),
    await generateAchievementNotification(userId),
    await generateSocialInteractionNotification(userId),
    await generateProgressUpdate(userId),
    await generateMotivationalMessage(userId),
  ];

  return notifications.filter((n) => n !== null);
}

export {
  generateAllNotifications,
};
