// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import loansRoutes from "./routes/loans.js";
import { pool } from "./db.js";

dotenv.config();
const app = express();

app.use(cors({ origin: ["http://localhost:3000", "http://127.0.0.1:3000"] })); // adjust origins as needed
app.use(express.json({ limit: "12mb" }));

// Health check
app.get("/", (req, res) => res.send({ status: "ok", message: "AI Loan Backend running" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/loans", loansRoutes);

// Start
const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  // optional: check DB connection
  try {
    await pool.query("SELECT 1");
    console.log("Connected to Postgres");
  } catch (err) {
    console.error("Postgres connection error:", err.message);
  }
  console.log(`Server listening on http://localhost:${PORT}`);
});
