import { Router } from "express";
import { createWorkoutTemplate, getFeed, getWorkoutTemplates } from "../controllers/workoutTemplatesController.js";

const router = Router();

// Creating a template
router.post("/", createWorkoutTemplate);
router.get("/feed", getFeed);
router.get("/", getWorkoutTemplates);

export { router };
