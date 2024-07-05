import { prisma } from "../utils/helpers.js";

const createWorkoutTemplate = async (req, res) => {
  const { name, exercises, isPublic } = req.body;
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
        isPublic,
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

    if (!userId) {
      console.error("User ID is missing in the request");
      return res.status(400).json({ error: "User ID is required" });
    }

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

const getWorkoutTemplateInfo = async (req, res) => {
  try {
    const { templateId } = req.params;

    if (!templateId) {
      console.error("Template ID is missing in the query params");
      return res.status(400).json({ error: "Template ID is required" });
    }

    const parsedTemplateId = parseInt(templateId);
    if (isNaN(parsedTemplateId)) {
      console.error("Invalid Template ID format");
      return res.status(400).json({ error: "Invalid Template ID format" });
    }

    const workoutTemplate = await prisma.workoutTemplate.findUnique({
      where: {
        id: parsedTemplateId,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
        user: {
          include: {
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!workoutTemplate) {
      console.error(`No workout template found with ID: ${templateId}`);
      return res.status(404).json({ error: "Workout template not found" });
    }

    res.json(workoutTemplate);
  } catch (error) {
    console.error("Error fetching workout template information:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the workout template" });
  }
};

const getFeed = async (req, res) => {
  try {
    const workoutTemplates = await prisma.workoutTemplate.findMany({
      where: {
        isPublic: true,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
        user: {
          include: {
            followers: true,
            following: true,
          },
        },
      },
    });

    res.json(workoutTemplates);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching your feed" + error });
  }
};

export {
  createWorkoutTemplate,
  getWorkoutTemplates,
  getFeed,
  getWorkoutTemplateInfo,
};
