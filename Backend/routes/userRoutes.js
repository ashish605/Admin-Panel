//roles can update their data routes

import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getMyProfile,
  updateMyProfile
} from "../controllers/authController.js";

const router = express.Router();

// User: View Own Profile
router.get("/profile", authMiddleware, getMyProfile);

// User: Update Own Profile
router.put("/profile", authMiddleware, updateMyProfile);

export default router;
