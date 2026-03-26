import jwt from "jsonwebtoken";

import asyncHandler from "../utils/asyncHandler.js";

const verifyAdmin = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Authorization token is required");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401);
    throw new Error("Authorization token is required");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = {
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    res.status(403);
    throw new Error("Invalid or expired admin token");
  }
});

export default verifyAdmin;
