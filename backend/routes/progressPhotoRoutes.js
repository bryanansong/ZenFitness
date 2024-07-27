import { Router } from "express";
import {
  getProgressPhotos,
  getUploadUrl,
  savePhotoDetails,
  deletePhoto,
} from "../controllers/progressPhotoController.js";
import multer from "multer";

const router = Router();

// photos middleware
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", getProgressPhotos);
router.get("/upload-url", getUploadUrl);
router.post("/", upload.single("image"), savePhotoDetails);
router.delete("/:id", deletePhoto);

export default router;
