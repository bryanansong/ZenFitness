import { Router } from "express";
import { createWorkoutSession } from "../controllers/workoutSessionsController.js";

const router = Router();

router.post("/", createWorkoutSession);

export { router };
