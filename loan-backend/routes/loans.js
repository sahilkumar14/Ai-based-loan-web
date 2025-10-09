// routes/loans.js
import express from "express";
import { pool } from "../db.js";
import { createLoanRequest, getAllLoanRequests, updateLoanStatus } from "../models/loanModel.js";
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

    // Map request into model's expected fields
    const modelData = {
      name: student_name,
      email: req.user.email || null,
      phone: null,
      loanAmount: amount,
      loanDuration: loan_duration || null,
      purpose: employment_type || null,
      familyannualincome: income || null,
      creditScore: credit_score || null,
      previousDefaults: previous_defaults === true || previous_defaults === "true",
      aadhar: null,
      dob: null
    };

    const newLoan = await createLoanRequest(modelData);
    return res.json({ success: true, message: "Loan submitted and under review", loan: newLoan });
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
    const rows = await getAllLoanRequests();
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
    if (!status) return res.status(400).json({ success: false, message: "Missing status" });
    const normalized = String(status).toLowerCase();
    const allowed = ["under_review", "approved", "cancelled"];
    if (!allowed.includes(normalized)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const updated = await updateLoanStatus(loanId, normalized);
    if (!updated) return res.status(404).json({ success: false, message: "Loan not found" });
    return res.json({ success: true, message: "Status updated", loan: updated });
  } catch (err) {
    console.error("Update status error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
