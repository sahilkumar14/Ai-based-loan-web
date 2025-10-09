import { pool } from "../db.js";

export const createLoanRequest = async (data) => {
  const {
    name, email, phone, loanAmount, loanDuration, purpose,
    familyannualincome, creditScore, previousDefaults, aadhar, dob
  } = data;

  const query = `
    INSERT INTO loan_applications
    (name, email, phone, loan_amount, loan_duration, purpose,
     family_income, credit_score, previous_defaults, aadhar, dob, status, created_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11, $12, NOW())
    RETURNING *;
  `;

  const values = [
    name, email, phone, loanAmount, loanDuration, purpose,
    familyannualincome, creditScore, previousDefaults, aadhar, dob
    , data.status || 'under_review'
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getAllLoanRequests = async () => {
  const q = `SELECT * FROM loan_applications ORDER BY created_at DESC`;
  const { rows } = await pool.query(q);
  return rows;
};

export const updateLoanStatus = async (id, status) => {
  const q = `UPDATE loan_applications SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *`;
  const { rows } = await pool.query(q, [status, id]);
  return rows[0];
};
