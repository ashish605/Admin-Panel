//powers routes

import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  getAdmins, getUsers, createAdmin, createUser,
  deleteAccount, updateAccount,promoteToAdmin
} from "../controllers/adminController.js";

const router = express.Router();

// Admin List (SuperAdmin only)
router.get("/admins", authMiddleware, authorizeRoles("SUPERADMIN"), getAdmins);

// User List (SuperAdmin + Admin)
router.get("/users", authMiddleware, authorizeRoles("SUPERADMIN", "ADMIN"), getUsers);

// Create Admin (SuperAdmin only)
router.post("/create-admin", authMiddleware, authorizeRoles("SUPERADMIN"), createAdmin);

// Create User
router.post("/create-user", authMiddleware, authorizeRoles("ADMIN","SUPERADMIN"), createUser);

// Update User/Admin (SuperAdmin + Admin)
router.put("/update/:id", authMiddleware, authorizeRoles("SUPERADMIN", "ADMIN"), updateAccount);

// Delete User/Admin (SuperAdmin only)
router.delete("/delete/:id", authMiddleware, authorizeRoles("SUPERADMIN"), deleteAccount);

// promote the user to admin by super admin
router.post("/promote/:id", authMiddleware, authorizeRoles("SUPERADMIN"), promoteToAdmin);

export default router;
