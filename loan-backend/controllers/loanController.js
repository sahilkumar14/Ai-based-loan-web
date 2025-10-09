import { createLoanRequest } from "../models/loanModel.js";

export const submitLoanForm = async (req, res) => {
  try {
    const data = req.body;

    if (!data.name || !data.email || !data.loanAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newLoan = await createLoanRequest(data);
    res.json({ message: "Loan request submitted successfully", loan: newLoan });
  } catch (err) {
    console.error("Error submitting loan:", err);
    res.status(500).json({ message: "Server error" });
  }
};
