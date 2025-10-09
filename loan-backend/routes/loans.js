// routes/loans.js
import express from "express";
import { v4 as uuidv4 } from "uuid";
import { pool } from "../db.js";
import { requireAuth, requireDistributor } from "../middleware/auth.js";

const router = express.Router();

/**
 * POST /api/loans/submit
 * body: { student_id? , student_name, loan_amount, income, credit_score, employment_type, loan_duration, previous_defaults }
 * This is open to students (or unauthenticated) — frontend should ideally include user token.
 */
router.post("/submit", requireAuth, async (req, res) => {
  try {
    // Only allow students to submit (optionally allow admin)
    if (req.user.role !== "student") {
      return res.status(403).json({ success: false, message: "Only students can submit loans" });
    }

    const {
      student_name,
      loan_amount,
      income,
      credit_score,
      employment_type,
      loan_duration,
      previous_defaults
    } = req.body;

    if (!student_name || !loan_amount) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Dummy fraud score logic (demo)
    let fraudScore = 10;
    const amount = Number(loan_amount);
    if (amount > 50000) fraudScore += 30;
    if (amount > 100000) fraudScore += 20;
    if (credit_score && Number(credit_score) < 600) fraudScore += 30;
    if (previous_defaults === true || previous_defaults === "true") fraudScore += 20;
    fraudScore = Math.min(95, Math.round(fraudScore));

    const id = uuidv4();
    const insertText = `
      INSERT INTO loans (id, student_id, student_name, loan_amount, income, credit_score, employment_type, loan_duration, previous_defaults, fraud_score, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const values = [
      id,
      req.user.id, // student user id from JWT
      student_name,
      amount,
      income || null,
      credit_score || null,
      employment_type || null,
      loan_duration || null,
      previous_defaults === true || previous_defaults === "true",
      fraudScore,
      "under_review"
    ];

    const { rows } = await pool.query(insertText, values);
    return res.json({ success: true, message: "Loan submitted and under review", loan: rows[0] });
  } catch (err) {
    console.error("Submit loan error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * GET /api/loans
 * Protected: distributor only
 */
router.get("/", requireAuth, requireDistributor, async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM loans ORDER BY created_at DESC");
    return res.json({ success: true, requests: rows });
  } catch (err) {
    console.error("Get loans error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * POST /api/loans/:id/status
 * Protected: distributor only
 * body: { status }
 */
router.post("/:id/status", requireAuth, requireDistributor, async (req, res) => {
  try {
    const loanId = req.params.id;
    const { status } = req.body;
    const allowed = ["under_review", "approved", "cancelled", "Reviewing", "Approved", "Cancelled"];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const { rowCount } = await pool.query("UPDATE loans SET status=$1 WHERE id=$2", [status, loanId]);
    if (rowCount === 0) return res.status(404).json({ success: false, message: "Loan not found" });
    return res.json({ success: true, message: "Status updated" });
  } catch (err) {
    console.error("Update status error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
