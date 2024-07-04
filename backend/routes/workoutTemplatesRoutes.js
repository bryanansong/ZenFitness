import { Router } from "express";
import { createWorkoutTemplate, getFeed, getWorkoutTemplateInfo, getWorkoutTemplates } from "../controllers/workoutTemplatesController.js";

const router = Router();

// Creating a template
router.post("/", createWorkoutTemplate);

router.get("/feed", getFeed);
router.get("/:templateId", getWorkoutTemplateInfo);
router.get("/", getWorkoutTemplates);

export { router };
