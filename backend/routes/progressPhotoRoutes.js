import { Router } from "express";
import {
  getProgressPhotos,
  getUploadUrl,
  savePhotoDetails,
  deletePhoto,
} from "../controllers/progressPhotoController.js";

const router = Router();

router.get("/", getProgressPhotos);
router.get("/upload-url", getUploadUrl);
router.post("/", savePhotoDetails);
router.delete("/:id", deletePhoto);

export default router;
