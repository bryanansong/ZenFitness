import { Prisma } from "@prisma/client";
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

const getWorkoutSessions = async (req, res) => {
  const userId = req.userId;

  try {
    const workoutSessions = await prisma.workoutSession.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        workoutTemplate: true,
        workoutSets: {
          include: {
            exercise: true,
          },
        },
      },
    });

    if (workoutSessions) {
      res.status(200).send(workoutSessions);
    }
  } catch (error) {
    console.error("Error retrieving workout sessions:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({
          error: "User not found.",
        });
      }
    }

    res.status(500).json({
      error: "An error occurred while retrieving workout sessions.",
    });
  }
};

export { createWorkoutSession, getWorkoutSessions };
