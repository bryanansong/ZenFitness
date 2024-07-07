import { Router } from "express";
import { getWorkoutStatistics } from "../controllers/workoutStatistics.js";

const router = Router();

router.get("/", getWorkoutStatistics);

export { router };
