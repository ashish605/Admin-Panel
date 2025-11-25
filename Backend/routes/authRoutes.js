//signin and login routes

import express from "express";

//rate limiter libarary
import rateLimit from "express-rate-limit";

import { signup, login } from "../controllers/authController.js";

import { forgotPassword, resetPassword } from "../controllers/authController.js";

import { createSuperAdmin } from "../controllers/authController.js";





const router = express.Router();

//making rate limiter which has 5 login attempts per 10 min per ip
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 7,
  message: "Too many login attempts. Try again later!",
});


router.post("/signup", signup);
router.post("/login", loginLimiter, login);//apppling rate limiter
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


// Temporary route for initial setup:
router.post("/create-superadmin", createSuperAdmin);





export default router;

