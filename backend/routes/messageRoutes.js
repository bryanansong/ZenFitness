import { Router } from "express";
import {
  getOrCreateChat,
  getChats,
  getMessages,
  createMessage,
} from "../controllers/messageController.js";

const router = Router();

router.post("/create-chat/:userId", getOrCreateChat);
router.get("/chats", getChats);
router.get("/:chatId", getMessages);
router.post("/", createMessage);

export default router;
