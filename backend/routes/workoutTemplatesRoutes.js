import { Router } from "express";
import {
  createWorkoutTemplate,
  getWorkoutTemplateInfo,
  getWorkoutTemplates,
  vote,
  copyWorkoutTemplate,
} from "../controllers/workoutTemplatesController.js";
import { getRecommendations } from "../controllers/recommendationController.js";

const router = Router();

router.post("/:templateId/vote", vote);
router.post("/:templateId/copy", copyWorkoutTemplate);
router.post("/", createWorkoutTemplate);

router.get("/feed", getRecommendations);
router.get("/:templateId", getWorkoutTemplateInfo);
router.get("/", getWorkoutTemplates);

export { router };
