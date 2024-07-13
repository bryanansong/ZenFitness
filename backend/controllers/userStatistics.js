import { prisma } from "../utils/helpers.js";

const getUserStatistics = async (req, res) => {
  const userId = req.userId;

  try {
    // Fetch all workout sessions for the user
    const workoutSessions = await prisma.workoutSession.findMany({
      where: { userId: userId },
      orderBy: { date: "desc" },
      include: {
        workoutSets: {
          include: { exercise: true },
        },
      },
    });

    const totalTimeWorkingout = workoutSessions.reduce(
      (total, session) => total + session.duration,
      0
    );
    const totalWorkouts = workoutSessions.length;
    const favoriteExercise = findFavoriteExercise(workoutSessions);
    const streak = calculateStreak(workoutSessions);

    const statistics = {
      totalTimeWorkingout,
      totalWorkouts,
      favoriteExercise,
      streak,
    };

    res.status(200).json(statistics);
  } catch (error) {
    console.error("Error retrieving workout statistics:", error);
    res.status(500).json({
      error: "An error occurred while retrieving workout statistics.",
    });
  }
};

// Helper function to find the favorite exercise
const findFavoriteExercise = (workoutSessions) => {
  const exerciseCounts = {};

  workoutSessions.forEach((session) => {
    session.workoutSets.forEach((set) => {
      const exerciseName = set.exercise.name;
      exerciseCounts[exerciseName] = (exerciseCounts[exerciseName] || 0) + 1;
    });
  });

  let favoriteExercise = "...";
  let maxCount = 0;

  for (const [exercise, count] of Object.entries(exerciseCounts)) {
    if (count > maxCount) {
      maxCount = count;
      favoriteExercise = exercise;
    }
  }

  return favoriteExercise;
};

// Helper function to calculate the streak
const calculateStreak = (workoutSessions) => {
  if (workoutSessions.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const session of workoutSessions) {
    const sessionDate = new Date(session.date);
    sessionDate.setHours(0, 0, 0, 0);

    if (sessionDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (sessionDate.getTime() < currentDate.getTime()) {
      break;
    }
  }

  return streak;
};

const getUserExerciseHistory = async (userId) => {
  try {
    const userSessions = await prisma.workoutSession.findMany({
      where: {
        userId: userId,
      },
      include: {
        workoutSets: {
          include: {
            exercise: true,
          },
        },
      },
    });

    // Extract unique exercise IDs from all workout sessions
    const exerciseIds = new Set();
    userSessions.forEach((session) => {
      session.workoutSets.forEach((set) => {
        exerciseIds.add(set.exercise.id);
      });
    });

    return Array.from(exerciseIds);
  } catch (error) {
    console.error("Error fetching user exercise history:", error);
    throw error;
  }
};

export { getUserStatistics, getUserExerciseHistory };
