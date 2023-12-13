import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

import {
  userSignup,
  userSignin,
  allUsers,
} from "../controllers/userController.js";
const router = express.Router();

router.post("/signup", userSignup);
router.post("/signin", userSignin);
router.get("/", authMiddleware, allUsers);

export default router;
