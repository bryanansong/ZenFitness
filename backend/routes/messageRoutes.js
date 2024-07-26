import { Router } from "express";
import {
  getChats,
  getMessages,
  createMessage,
} from "../controllers/messageController.js";

const router = Router();

router.get("/chats", getChats);
router.get("/:chatId", getMessages);
router.post("/", createMessage);

export default router;
