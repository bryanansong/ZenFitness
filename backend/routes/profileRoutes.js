import { Router } from "express";
import {
  getProfile,
  getCurrentUser,
  followUser,
  unfollowUser,
  getFollowStatus,
} from "../controllers/profileController.js";

const router = Router();

router.get("/current-user", getCurrentUser);
router.get("/:userId", getProfile);
router.post("/:userId/follow", followUser);
router.delete("/:userId/follow", unfollowUser);
router.get("/:userId/follow-status", getFollowStatus);

export { router };
