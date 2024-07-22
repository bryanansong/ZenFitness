import { prisma } from "../utils/helpers.js";

const DAYS_TO_CONSIDER = 14;

const calculateRecentActivityScore = async (userId) => {
  try {
    const userInterest = await prisma.userInterest.findUnique({
      where: { userId },
      include: {
        user: {
          include: {
            workoutSessions: true,
            workoutTemplates: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!userInterest) {
      console.log(`No user interest found for user ID: ${userId}`);
      return null;
    }

    let score = 0;
    const now = new Date();
    const fourteenDaysAgo = new Date(
      now - DAYS_TO_CONSIDER * 24 * 60 * 60 * 1000
    );

    // Calculate score for workout sessions
    const recentSessions = userInterest.user.workoutSessions.filter(
      (session) => session.date >= fourteenDaysAgo
    );
    score += recentSessions.length * 10;

    // Calculate score for created templates
    const recentTemplates = userInterest.user.workoutTemplates.filter(
      (template) => template.createdAt >= fourteenDaysAgo
    );
    score += recentTemplates.length * 5;

    // Calculate score for new followers
    const recentFollowers = userInterest.user.followers.filter(
      (follower) => follower.createdAt >= fourteenDaysAgo
    );
    score += recentFollowers.length * 2;

    // Calculate score for new followings
    const recentFollowings = userInterest.user.following.filter(
      (following) => following.createdAt >= fourteenDaysAgo
    );
    score += recentFollowings.length * 1;

    // Update the user's activity score
    const updatedUserInterest = await prisma.userInterest.update({
      where: { userId },
      data: {
        activityScore: score,
        lastWorkoutDate:
          recentSessions.length > 0
            ? recentSessions[0].date
            : userInterest.lastWorkoutDate,
        updatedAt: new Date(),
      },
    });

    console.log(`Updated activity score for user ${userId}: ${score}`);
    return updatedUserInterest;
  } catch (error) {
    console.error(
      `Error calculating recent activity score for user ${userId}:`,
      error
    );
    throw error;
  }
};

export { calculateRecentActivityScore };
