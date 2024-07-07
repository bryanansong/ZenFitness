import { Router } from "express";
import { createWorkoutSession, getWorkoutSessions } from "../controllers/workoutSessionsController.js";

const router = Router();

router.post("/", createWorkoutSession);
router.get("/", getWorkoutSessions);

export { router };
