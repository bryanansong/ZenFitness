import { prisma } from "../utils/helpers.js";

const createWorkoutSession = async (req, res) => {
  const { workoutTemplateId, date, duration, completionStatus, workoutSets } =
    req.body;
  const userId = req.userId;

  try {
    if (!duration || !completionStatus || workoutSets.length === 0) {
      return res.status(400).json({
        error:
          "Invalid input. All fields are required and workoutSets must not be empty.",
      });
    }

    if (duration <= 0) {
      return res.status(400).json({
        error: "Duration must be greater than 0.",
      });
    }

    if (!["COMPLETED", "PARTIAL"].includes(completionStatus)) {
      return res.status(400).json({
        error:
          "Invalid completionStatus. Must be either 'COMPLETED' or 'PARTIAL'.",
      });
    }

    const workoutSession = await prisma.workoutSession.create({
      data: {
        userId,
        workoutTemplateId,
        date: new Date(date),
        duration,
        completionStatus,
        workoutSets: {
          create: workoutSets.map((set) => ({
            exerciseId: set.exerciseId,
            reps: set.reps,
            weight: set.weight,
          })),
        },
      },
      include: {
        workoutSets: {
          include: {
            exercise: true,
          },
        },
        workoutTemplate: true,
      },
    });

    res.status(201).json(workoutSession);
  } catch (error) {
    console.error("Error creating workout session:", error);
    res.status(500).json({
      error: "An error occurred while creating the workout session.",
    });
  }
};

export { createWorkoutSession };
