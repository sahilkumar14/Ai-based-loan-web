import React, { useState } from "react";

export default function StudentDashboard() {
  const initialState = {
    name: "",
    email: "",
    phone: "",
    loanAmount: "",
    loanDuration: "",
    purpose: "",
    familyannualincome: "",
    creditScore: "",
    previousDefaults: "No",
    aadhar: "",
    dob: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const next = () => {
    // simple validation per step
    if (step === 1) {
      if (!formData.name || !formData.email) return alert('Please fill name and email');
    }
    if (step === 2) {
      if (!formData.loanAmount || !formData.loanDuration) return alert('Please fill loan amount and duration');
    }
    setStep((s) => Math.min(totalSteps, s + 1));
  };

  const prev = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("https://localhost:8000/api/auth/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      alert(data.message || "Your loan is under review");
      setFormData(initialState);
      setStep(1);
    } catch (err) {
      console.error(err);
      alert("Error submitting loan request");
    } finally {
      setSubmitting(false);
    }
  };

  // small helper for animated classes
  const stepClass = (n) => {
    if (n === step) return "translate-x-0 opacity-100 z-20";
    if (n < step) return "-translate-x-8 opacity-0 pointer-events-none absolute z-10";
    return "translate-x-8 opacity-0 pointer-events-none absolute z-10";
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Submit Loan Request</h1>

      <div className="w-full max-w-2xl">
        {/* progress */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((n) => {
              const progressClass = n < step ? 'bg-green-500' : n === step ? 'bg-blue-400' : 'bg-gray-200';
              return (
                <div key={n} className="flex-1">
                  <div className={`h-2 rounded ${progressClass}`} style={{ transition: 'background-color 300ms' }} />
                  <div className="text-xs text-center mt-1">{n === 1 ? 'Personal' : n === 2 ? 'Loan' : 'Financial'}</div>
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative bg-white p-6 rounded-lg shadow-md overflow-hidden">
          {/* Step 1 - Personal */}
          <div className={`transition-transform duration-300 ease-in-out ${stepClass(1)}`}>
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Full name</label>
                <input name="name" value={formData.name} onChange={handleChange} className="w-full border p-3 rounded-lg" placeholder="e.g. Aisha Khan" />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input name="email" value={formData.email} onChange={handleChange} className="w-full border p-3 rounded-lg" placeholder="you@example.com" />
              </div>

              <div>
                <label className="block mb-1">Aadhar number</label>
                <input name="aadhar" value={formData.aadhar} onChange={handleChange} className="w-full border p-3 rounded-lg" placeholder="xxxx-xxxx-xxxx" />
              </div>
              <div>
                <label className="block mb-1">Date of Birth</label>
                <input name="dob" type="date" value={formData.dob} onChange={handleChange} className="w-full border p-3 rounded-lg" />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1">Phone (optional)</label>
                <input name="phone" value={formData.phone} onChange={handleChange} className="w-full border p-3 rounded-lg" placeholder="+91-..." />
              </div>
            </div>
          </div>

          {/* Step 2 - Loan details */}
          <div className={`transition-transform duration-300 ease-in-out ${stepClass(2)}`}>
            <h2 className="text-lg font-semibold mb-4">Loan Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Loan Amount (₹)</label>
                <input name="loanAmount" type="number" value={formData.loanAmount} onChange={handleChange} className="w-full border p-3 rounded-lg" />
              </div>
              <div>
                <label className="block mb-1">Loan Duration (months)</label>
                <input name="loanDuration" type="number" value={formData.loanDuration} onChange={handleChange} className="w-full border p-3 rounded-lg" />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1">Purpose</label>
                <input name="purpose" value={formData.purpose} onChange={handleChange} className="w-full border p-3 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Step 3 - Financial */}
          <div className={`transition-transform duration-300 ease-in-out ${stepClass(3)}`}>
            <h2 className="text-lg font-semibold mb-4">Financial Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Family Annual Income (₹)</label>
                <input name="familyannualincome" type="number" value={formData.familyannualincome} onChange={handleChange} className="w-full border p-3 rounded-lg" />
              </div>
              <div>
                <label className="block mb-1">Credit Score (optional)</label>
                <input name="creditScore" type="number" value={formData.creditScore} onChange={handleChange} className="w-full border p-3 rounded-lg" />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1">Previous loan defaults?</label>
                <select name="previousDefaults" value={formData.previousDefaults} onChange={handleChange} className="w-full border p-3 rounded-lg">
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-between">
            <div>
              <button type="button" onClick={prev} disabled={step === 1} className="px-4 py-2 rounded border bg-white disabled:opacity-50">
                Back
              </button>
            </div>
            <div className="flex gap-2">
              {step < totalSteps ? (
                <button type="button" onClick={next} className="px-4 py-2 rounded bg-blue-600 text-white">Next</button>
              ) : (
                <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-green-600 text-white">{submitting ? 'Submitting...' : 'Submit'}</button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
