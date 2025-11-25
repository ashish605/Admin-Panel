import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pkg from '@prisma/client';
import crypto from "crypto";
import { sendEmail } from "../utils/email.js";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();


// SIGN UP (User)
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: "USER" }
    });

    res.status(201).json({ message: "Signup success", user: newUser });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// LOGIN  //ip restrication
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: "Invalid password" });

    const currentIP = req.ip;

    // If user has logged in before, check IP
    if (user.lastLoginIP && user.lastLoginIP !== currentIP) {
      return res.status(403).json({
        message: "Suspicious login detected! Access denied.",
        reason: "IP mismatch"
      });
    }

    // Save current IP if first login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginIP: currentIP }
    });

    // Create JWT Token
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email,name: user.name  },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      token,
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





// USER — View Own Profile
export const getMyProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  res.json({ user });
};


// USER — Update Own Profile
export const updateMyProfile = async (req, res) => {
  const { name } = req.body;

  const updated = await prisma.user.update({
    where: { id: req.user.id },
    data: { name }
  });

  res.json({ message: "Profile updated", updated });
};



// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "Email not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExp = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExp }
    });

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    await sendEmail(
      email,
      "Reset Your Password",
      `<h3>Click below to reset password:</h3>
       <a href="${resetLink}">${resetLink}</a>`
    );

    res.json({
      message: "Reset link sent to email!",
      resetLink // for testing also returned
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExp: { gt: new Date() }
      }
    });

    if (!user)
      return res.status(400).json({ message: "Token expired or invalid" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExp: null
      }
    });

    res.json({ message: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// CREATE SUPERADMIN (Temporary route for setup only)
export const createSuperAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "SuperAdmin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "SUPERADMIN"
      }
    });

    const token = jwt.sign(
      { id: admin.id, role: admin.role, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(201).json({
      message: "SuperAdmin Created Successfully",
      token,
      admin
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
