// routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || "8h";

/**
 * POST /api/auth/signup
 * body: { full_name, email, password, role, photo? }
 */
router.post("/signup", async (req, res) => {
  try {
    const { full_name, email, password, role, photo } = req.body;
    if (!full_name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // check existing
    const exists = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const insertText = `
      INSERT INTO users (full_name, email, password_hash, role, photo)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, full_name, email, role, created_at
    `;
    const result = await pool.query(insertText, [full_name, email, password_hash, role, photo || null]);
    const user = result.rows[0];

    return res.json({ success: true, message: "Signup successful", user });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * POST /api/auth/login
 * body: { email, password, role }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: "Missing credentials" });
    }

    const q = "SELECT id, full_name, email, password_hash, role FROM users WHERE email=$1 AND role=$2";
    const { rows } = await pool.query(q, [email, role]);
    if (!rows || rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, name: user.full_name, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user.id, name: user.full_name, role: user.role, email: user.email }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
