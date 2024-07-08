import { Router } from "express";
import { createWorkoutTemplate, getFeed, getWorkoutTemplateInfo, getWorkoutTemplates, voteWorkoutTemplate } from "../controllers/workoutTemplatesController.js";

const router = Router();

router.post("/:templateId/vote", voteWorkoutTemplate);
router.post("/", createWorkoutTemplate);

router.get("/feed", getFeed);
router.get("/:templateId", getWorkoutTemplateInfo);
router.get("/", getWorkoutTemplates);

export { router };
