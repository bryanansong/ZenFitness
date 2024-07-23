import { Router } from "express";
import { getUserStatistics, getWorkoutHeatmapData } from "../controllers/userStatistics.js";

const router = Router();

router.get("/", getUserStatistics);
router.get("/heatmap", getWorkoutHeatmapData);

export { router };
