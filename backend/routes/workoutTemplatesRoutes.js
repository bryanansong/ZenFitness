import { Router } from "express";
import { createWorkoutTemplate, getWorkoutTemplates } from "../controllers/workoutTemplatesController.js";

const router = Router();

// Creating a template
router.post("/", createWorkoutTemplate);
router.get("/", getWorkoutTemplates);

export { router };
