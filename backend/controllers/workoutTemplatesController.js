import { prisma } from "../utils/helpers.js";

const createWorkoutTemplate = async (req, res) => {
  const { name, exercises } = req.body;
  const userId = req.userId;

  try {
    if (!name || !Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({
        error:
          "Invalid input. Template name and at least one exercise are required.",
      });
    }

    const workoutTemplate = await prisma.workoutTemplate.create({
      data: {
        name,
        userId,
        exercises: {
          create: await Promise.all(
            exercises.map(async (exercise) => ({
              exercise: {
                connectOrCreate: {
                  where: { name: exercise },
                  create: {
                    name: exercise,
                  },
                },
              },
            }))
          ),
        },
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });

    res.status(201).json(workoutTemplate);
  } catch (error) {
    console.error("Error creating workout template:", error);
    res.status(500).json({
      error: "An error occurred while creating the workout template.",
    });
  }
};

const getWorkoutTemplates = async (req, res) => {
  try {
    const userId = req.userId;

    const workoutTemplates = await prisma.workoutTemplate.findMany({
      where: {
        userId: userId,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });

    res.json(workoutTemplates);
  } catch (error) {
    console.error("Error fetching workout templates:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching workout templates" });
  }
};

export { createWorkoutTemplate, getWorkoutTemplates };
