// middleware/auth.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Missing token" });
  }
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // payload contains id, name, role
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

// middleware to restrict to distributor
export function requireDistributor(req, res, next) {
  if (!req.user) return res.status(401).json({ success: false, message: "Missing authentication" });
  if (req.user.role !== "distributor") {
    return res.status(403).json({ success: false, message: "Forbidden: distributor only" });
  }
  next();
}
