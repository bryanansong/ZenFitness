import { Router } from "express";
import { createWorkoutTemplate } from "../controllers/workoutTemplatesController.js";

const router = Router();

// Creating a template
router.post("/", createWorkoutTemplate);

export { router };
