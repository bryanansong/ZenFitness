import { Router } from "express";
import { getNotifications, markNotificationAsRead } from "../controllers/notificationController.js";

const router = Router();

router.get("/", getNotifications);
router.put("/:notificationId/read", markNotificationAsRead);

export default router;
