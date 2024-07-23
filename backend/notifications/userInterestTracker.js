import { prisma } from "../utils/helpers.js";

const DAYS_TO_CONSIDER = 14;
const ACTION_SCORES = {
  CREATE_TEMPLATE: 5,
  COMPLETE_WORKOUT: 3,
  COPY_TEMPLATE: 2,
  VOTE_TEMPLATE: 1,
};

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

const updateUserInterestCategories = async (userId, action, data) => {
  const userInterest = await prisma.userInterest.findUnique({
    where: { userId },
    include: { interests: true },
  });

  if (!userInterest) {
    console.log(`No user interest found for user ID: ${userId}`);
    return null;
  }

  const categoryScores = {};

  if (!ACTION_SCORES[action]) {
    console.log(`Unknown action: ${action}`);
    return null;
  }

  const actionScore = ACTION_SCORES[action];

  data.exercises.forEach((exercise) => {
    const category = exercise.name;
    categoryScores[category] = (categoryScores[category] || 0) + actionScore;
  });

  // Update or create interest categories
  for (const [category, score] of Object.entries(categoryScores)) {
    await prisma.userInterestCategory.upsert({
      where: {
        userInterestId_category: {
          userInterestId: userInterest.id,
          category,
        },
      },
      update: {
        score: { increment: score },
      },
      create: {
        userInterestId: userInterest.id,
        category,
        score,
      },
    });
  }

  return await prisma.userInterest.findUnique({
    where: { userId },
    include: { interests: true },
  });
};

const getTopCategories = async (userId, count = 3) => {
  const userInterest = await prisma.userInterest.findUnique({
    where: { userId },
    include: { interests: true },
  });

  if (!userInterest) {
    return [];
  }

  return userInterest.interests
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((interest) => interest.category);
};

export {
  calculateRecentActivityScore,
  updateUserInterestCategories,
  getTopCategories,
};
