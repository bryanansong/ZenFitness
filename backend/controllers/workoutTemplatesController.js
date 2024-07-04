import { prisma } from "../utils/helpers.js";

const createWorkoutTemplate = async (req, res) => {
  console.log("We got to the controller!!!");
  const { name, exercises } = req.body;
  const userId = req.userId; // Assuming you have authentication middleware that adds user to req

  try {
    // Input validation
    if (!name || !Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({
        error:
          "Invalid input. Template name and at least one exercise are required.",
      });
    }

    // Create the workout template
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

export { createWorkoutTemplate };
