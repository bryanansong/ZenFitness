import { getMaxValuesWithCache } from "../controllers/recommendationController.js";
import { getTemplateRecommendationScore } from "../templateRecs/templateRecommendation.js";
import { calculateDaysSinceLastWorkout, prisma } from "../utils/helpers.js";
import { getTopCategories } from "./userInterestTracker.js";

const generateAllNotifications = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userInterests: { include: { interests: true } },
      workoutSessions: { orderBy: { date: "desc" }, take: 5 },
      followers: {
        orderBy: { createdAt: "desc" },
        include: { follower: true },
        take: 1,
      },
    },
  });

  if (!user || !user.userInterests) return [];

  const daysSinceLastWorkout = calculateDaysSinceLastWorkout(
    user.userInterests
  );

  const notifications = [];

  if (daysSinceLastWorkout > 3) {
    notifications.push({
      type: "workout_reminder",
      content: `It's been ${daysSinceLastWorkout} days since your last workout. Time to get moving!`,
    });
  }

  const topCategories = await getTopCategories(userId, 3);

  if (topCategories.length > 0) {
    const publicTemplates = await prisma.workoutTemplate.findMany({
      where: {
        isPublic: true,
        exercises: {
          some: {
            exercise: {
              name: {
                in: topCategories,
              },
            },
          },
        },
      },
      include: {
        user: {
          include: { followers: true },
        },
      },
      take: 10,
    });

    const maxValues = await getMaxValuesWithCache(publicTemplates);

    const scoredTemplates = await Promise.all(
      publicTemplates.map(async (template) => ({
        ...template,
        notifScore: await getTemplateRecommendationScore(
          template,
          userId,
          maxValues
        ),
      }))
    );
    // Sort templates
    scoredTemplates.sort((a, b) => b.notifScore - a.notifScore);

    // Pick top scored template
    const selectedTemplate = scoredTemplates[0];

    notifications.push({
      type: "template_recommendation",
      content: `Check out this workout template made by @${selectedTemplate.user.username}: ${selectedTemplate.name}`,
    });
  }

  const workoutCount = user.workoutSessions.length;

  if (workoutCount % 10 === 0) {
    notifications.push({
      type: "achievement",
      content: `Congratulations! You've completed ${workoutCount.toLocaleString()} workouts. Keep up the great work!`,
    });
  }

  const recentFollow = user.followers[0];
  const daysSinceFollow = Math.floor(
    (Date.now() - recentFollow.createdAt.getTime()) / (1000 * 3600 * 24)
  );

  if (recentFollow && daysSinceFollow <= 3) {
    notifications.push({
      type: "social_interaction",
      content: `${recentFollow.follower.username} started following you!`,
    });
  }

  if (user.workoutSessions.length >= 5) {
    const averageDuration =
      user.workoutSessions.reduce((sum, session) => sum + session.duration, 0) /
      5;

    notifications.push({
      type: "progress_update",
      content: `Great job! Your average workout duration over the last 5 sessions is ${Math.round(
        averageDuration
      )} minutes.`,
    });
  }

  if (user.userInterests.activityScore < 30) {
    const messages = [
      "Every workout brings you closer to your goals. Let's get started!",
      "Small steps lead to big changes. How about a quick workout today?",
      "You've got this! Even a short workout can make a big difference.",
    ];
    notifications.push({
      type: "motivation",
      content: messages[Math.floor(Math.random() * messages.length)],
    });
  }

  return notifications;
};

export { generateAllNotifications };
