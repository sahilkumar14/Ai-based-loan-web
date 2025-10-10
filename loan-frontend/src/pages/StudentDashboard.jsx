import React, { useState, useRef, useEffect } from "react";

export default function StudentDashboard() {
  const [metrics, setMetrics] = useState({
    typingSpeed: 0,
    hesitationTime: 0,
    errorCount: 0,
    mouseDistance: 0,
    scrollEvents: 0,
    clickPatternVariability: 0,
  });

  // --- INTERNAL TRACKERS ---
  const lastKeyTime = useRef(null);
  const keyCount = useRef(0);
  const hesitationSum = useRef(0);
  const backspaceCount = useRef(0);

  const lastMouse = useRef({ x: 0, y: 0 });
  const totalMouseDistance = useRef(0);

  const scrollCount = useRef(0);
  const clickTimes = useRef([]);

  // We will send metrics only once (on unload or before form submit).
  // Keep a guard so we never send multiple times.
  const sentRef = useRef(false);

  // Send on unmount / page unload — use sendBeacon when possible to avoid blocking
  useEffect(() => {
    const handleBeforeUnload = () => {
      // prefer sendBeacon for unload
      sendMetrics({ useBeacon: true });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      // also attempt to send on component unmount
      sendMetrics({ useBeacon: true });
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- TRACK KEYBOARD ACTIVITY ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      const now = Date.now();

      if (lastKeyTime.current) {
        const diff = now - lastKeyTime.current;
        hesitationSum.current += diff;
      }

      lastKeyTime.current = now;
      keyCount.current++;

      if (e.key === "Backspace") {
        backspaceCount.current++;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // --- TRACK MOUSE MOVEMENT ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { x, y } = e;
      const dx = x - lastMouse.current.x;
      const dy = y - lastMouse.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      totalMouseDistance.current += dist;
      lastMouse.current = { x, y };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // --- TRACK SCROLLS ---
  useEffect(() => {
    const handleScroll = () => {
      scrollCount.current++;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  // --- TRACK CLICK VARIABILITY ---
  useEffect(() => {
    const handleClick = () => {
      const now = Date.now();
      clickTimes.current.push(now);
      if (clickTimes.current.length > 10) clickTimes.current.shift();
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);


  // --- SEND METRICS TO BACKEND ---
  const sendMetrics = async ({ useBeacon = false } = {}) => {
    const avgHesitation = keyCount.current > 1 ? hesitationSum.current / keyCount.current : 0;
    const typingSpeed = keyCount.current > 0 ? (keyCount.current / (avgHesitation + 1)) * 1000 : 0;
    const clickIntervals = clickTimes.current
      .map((t, i, arr) => (i === 0 ? 0 : t - arr[i - 1]))
      .filter(Boolean);
    const variability =
      clickIntervals.length > 1
        ? Math.sqrt(
            clickIntervals
              .map((v) => Math.pow(v - clickIntervals.reduce((a, b) => a + b, 0) / clickIntervals.length, 2))
              .reduce((a, b) => a + b, 0) / clickIntervals.length
          )
        : 0;


        const dataToSend = {
          page: "student_dashboard",
          typingSpeed: parseFloat(typingSpeed.toFixed(2)),
          hesitationTime: parseFloat(avgHesitation.toFixed(2)),
          errorCount: backspaceCount.current,
          mouseDistance: parseFloat(totalMouseDistance.current.toFixed(2)),
          scrollEvents: scrollCount.current,
          clickPatternVariability: parseFloat(variability.toFixed(2)),
          timestamp: Date.now(),
        };
        
        
    // Prevent multiple sends
    if (sentRef.current) return;
    sentRef.current = true;

    try {
      const payload = JSON.stringify(dataToSend);
      // If useBeacon requested and available, use it (synchronous-ish for unload)
      if (useBeacon && typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
  const blob = new Blob([payload], { type: 'application/json' });
  const ok = navigator.sendBeacon('http://localhost:8000/api/loans/behaviour', blob);
        console.log('✅ Sent behavior data via sendBeacon:', ok, dataToSend);
      } else {
        // Use fetch with keepalive to allow sending during unload; also used on submit
        await fetch('http://localhost:8000/api/loans/behaviour', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        });
        console.log('✅ Sent behavior data via fetch:', dataToSend);
      }
    } catch (err) {
      console.error('❌ Failed to send metrics:', err);
    }

    // Reset trackers after sending
    keyCount.current = 0;
    hesitationSum.current = 0;
    backspaceCount.current = 0;
    totalMouseDistance.current = 0;
    scrollCount.current = 0;
  };

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
      // 1) Call behaviour endpoint to get a risk/behaviour score
      const behRes = await fetch("http://localhost:8000/api/loans/behaviour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const behData = await behRes.json();

      // Store behaviour result and show a confirmation to user
      setBehaviourResult(behData);
      setShowBehaviourModal(true);

      // Wait for user confirmation (handled via UI buttons). When user confirms,
      // submitConfirmed() will call the submit endpoint and close the modal.
    } catch (err) {
      console.error(err);
      alert("Error checking behaviour score");
      setSubmitting(false);
    }
  };

  // Behaviour modal state
  const [showBehaviourModal, setShowBehaviourModal] = useState(false);
  const [behaviourResult, setBehaviourResult] = useState(null);

  const submitConfirmed = async (confirm) => {
    // If user cancelled, just close modal and stop submitting
    if (!confirm) {
      setShowBehaviourModal(false);
      setBehaviourResult(null);
      setSubmitting(false);
      return;
    }

    // proceed to call submit endpoint
    try {
      const res = await fetch("http://localhost:8000/api/loans/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      alert((behaviourResult?.explanation ? behaviourResult.explanation + ' — ' : '') + (data.message || "Your loan is under review"));
      setFormData(initialState);
      setStep(1);
    } catch (err) {
      console.error(err);
      alert("Error submitting loan request");
    } finally {
      setShowBehaviourModal(false);
      setBehaviourResult(null);
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
              {step < totalSteps && (
                <button
                  type="button"
                  onClick={next}
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                >
                  Next
                </button>
              )}
              {step === totalSteps && (
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded bg-green-600 text-white"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Behaviour confirmation modal */}
      {showBehaviourModal && behaviourResult && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold mb-2">Behaviour Check</h3>
            <p className="mb-4">Score: <strong>{behaviourResult.behaviourScore}</strong></p>
            <p className="mb-4 text-sm text-gray-700">{behaviourResult.explanation}</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => submitConfirmed(false)} className="px-4 py-2 rounded border bg-white">Cancel</button>
              <button onClick={() => submitConfirmed(true)} className="px-4 py-2 rounded bg-green-600 text-white">Confirm & Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
