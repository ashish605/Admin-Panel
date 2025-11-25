import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
import bcrypt from "bcryptjs";


// SUPERADMIN: Admin List
export const getAdmins = async (req, res) => {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true, name: true, email: true, role: true }
  });
  res.json({ admins });
};


// SUPERADMIN + ADMIN: User List
export const getUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    where: { role: "USER" },
    select: { id: true, name: true, email: true, role: true }
  });
  res.json({ users });
};




// SUPERADMIN: Create Admin
export const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await prisma.user.create({
    data: { name, email, password: hashedPassword, role: "ADMIN" }
  });

  res.json({ message: "Admin Created", admin });
};


// ADMIN: Create User
export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role: "USER" }
  });

  res.json({ message: "User Created", user });
};


// SUPERADMIN: Delete Admin or User
export const deleteAccount = async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.role === "SUPERADMIN")
    return res.status(403).json({ message: "Cannot delete SuperAdmin" });

  await prisma.user.delete({ where: { id } });
  res.json({ message: `${user.role} deleted successfully` });
};




// SUPERADMIN + ADMIN: UPDATE USER (NOT SUPERADMIN)
export const updateAccount = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.role === "SUPERADMIN")
    return res.status(403).json({ message: "Cannot update SuperAdmin" });

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { name }
  });

  res.json({ message: "User updated", updatedUser });
};


// SUPERADMIN: Promote user to ADMIN
export const promoteToAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // find user
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "SUPERADMIN")
      return res.status(403).json({ message: "Cannot modify SuperAdmin" });

    // update role to ADMIN
    const updated = await prisma.user.update({
      where: { id },
      data: { role: "ADMIN" },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    res.json({ message: "User promoted to ADMIN", user: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};