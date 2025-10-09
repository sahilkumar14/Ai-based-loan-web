import React, { useEffect, useState } from "react";

const INLINE_MOCK_REQUESTS = [
  {
    id: 'r1',
    studentName: 'Aisha Khan',
    studentEmail: 'aisha.khan@example.com',
    loanAmount: 50000,
    fraudScore: 12,
    status: 'under_review',
    requestDate: '2025-10-01T10:15:00Z',
    purpose: 'Tuition fees for semester 2',
    course: 'BCom',
    phone: '+91-9876543210',
  },
  {
    id: 'r2',
    studentName: 'Rohit Verma',
    studentEmail: 'rohit.verma@example.com',
    loanAmount: 150000,
    fraudScore: 68,
    status: 'under_review',
    requestDate: '2025-09-22T14:20:00Z',
    purpose: 'Laptop and course materials',
    course: 'BTech Computer Science',
    phone: '+91-9123456780',
  },
  {
    id: 'r3',
    studentName: 'Meera Patel',
    studentEmail: 'meera.patel@example.com',
    loanAmount: 80000,
    fraudScore: 85,
    status: 'under_review',
    requestDate: '2025-09-30T09:00:00Z',
    purpose: 'Living expenses',
    course: 'MBA',
    phone: '+91-9988776655',
  },
];

export default function DistributorDashboard() {
  const [requests, setRequests] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await fetch("https://your-backend.com/getLoanRequests");
      const data = await res.json();
      const fetched = data.requests || [];
      setRequests(fetched.length ? fetched : INLINE_MOCK_REQUESTS);
    } catch (err) {
      // fallback to inline mock data when API is unavailable
      setRequests(INLINE_MOCK_REQUESTS);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const updateStatus = async (id, status) => {
    // optimistic UI update
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      await fetch("https://your-backend.com/updateLoanStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      // re-fetch to ensure server-state parity
      fetchRequests();
    } catch (err) {
      // If update fails, we could revert or show an error. For now, leave optimistic change.
      console.error('Failed to update status', err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Loan Requests</h1>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {requests.map((r) => {
          const expanded = expandedId === r.id;
          return (
            <div
              key={r.id}
              className={`bg-white rounded-lg shadow p-4 hover:shadow-md transition cursor-pointer border ${expanded ? 'ring-2 ring-blue-300' : ''}`}
              onClick={() => setExpandedId(expanded ? null : r.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{r.studentName}</h2>
                  <p className="text-sm text-gray-500">{r.studentEmail || ''}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">₹{r.loanAmount}</div>
                  <div className={`text-sm font-medium ${r.fraudScore > 70 ? 'text-red-600' : r.fraudScore > 40 ? 'text-yellow-600' : 'text-green-600'}`}>{r.fraudScore}% fraud</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-gray-600">Status: <span className="font-medium">{r.status}</span></div>
                <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2">
                  <select
                    value={r.status}
                    onChange={(e) => updateStatus(r.id, e.target.value)}
                    className="border p-1 rounded bg-white"
                  >
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {expanded && (
                <div className="mt-4 text-sm text-gray-700 border-t pt-3">
                  <p><span className="font-medium">Requested on:</span> {new Date(r.requestDate || r.createdAt || Date.now()).toLocaleString()}</p>
                  <p className="mt-2"><span className="font-medium">Purpose:</span> {r.purpose || '—'}</p>
                  <p className="mt-2"><span className="font-medium">Course:</span> {r.course || '—'}</p>
                  <p className="mt-2"><span className="font-medium">Phone:</span> {r.phone || '—'}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => updateStatus(r.id, 'approved')}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >Approve</button>
                    <button
                      onClick={() => updateStatus(r.id, 'cancelled')}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >Cancel</button>
                    <button
                      onClick={() => setExpandedId(null)}
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded"
                    >Close</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
