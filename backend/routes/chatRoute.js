import {
  accessChats,
  deleteAllChats,
  fetchChats,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
} from "../controllers/chatController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Router } from "express";

const chatrouter = Router();

chatrouter.post("/", authMiddleware, accessChats);

chatrouter.delete("/deletechat", deleteAllChats);
chatrouter.get("/", authMiddleware, fetchChats);

chatrouter.post("/creategroup", authMiddleware, createGroup);
chatrouter.put("/renamegroup", authMiddleware, renameGroup);
chatrouter.put("/removefromgroup", authMiddleware, removeFromGroup);
chatrouter.put("/addtogroup", authMiddleware, addToGroup);

export default chatrouter;
