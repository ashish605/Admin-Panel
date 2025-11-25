//jwt middleware to check the jwt token before acessing routes

import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // attach decoded token data (id, role, email)
    next(); // continue to controller
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};
