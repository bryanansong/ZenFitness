import { Router } from "express";
import { getNetVotes } from "../controllers/templateStatisticsController.js";

const router = Router();

router.get("/net-votes/:templateId", getNetVotes);

export { router };
