import { Router } from "express";
import { getUserStatistics } from "../controllers/userStatistics.js";

const router = Router();

router.get("/", getUserStatistics);

export { router };
