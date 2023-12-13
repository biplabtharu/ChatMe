import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  sendMessage,
  fetchMessage,
  deleteMessage,
} from "../controllers/messageController.js";
const messageRoute = Router();

messageRoute.post("/", authMiddleware, sendMessage);
messageRoute.get("/:chatId", authMiddleware, fetchMessage);
messageRoute.delete("/deletemessage", deleteMessage);

export default messageRoute;
