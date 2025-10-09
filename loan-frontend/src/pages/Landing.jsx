import React from "react";
import { Link } from "react-router-dom";
import bgImage from "../assets/2563.jpg";

export default function Landing() {
  const bgStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="min-h-screen text-gray-800 relative">
      {/* background image behind everything */}
      <div className="absolute inset-0 -z-10" style={bgStyle} aria-hidden />
      {/* overlay sits above image but behind content */}
      <div className="absolute inset-0 z-0 bg-black/10" aria-hidden />
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-black leading-tight">
              Protect your lending business with <span className="text-blue-600">AI-powered fraud detection.</span>
            </h1>
            <p className="mt-6 text-lg text-black/90 max-w-xl">
              Spot suspicious loan applications instantly. Reduce defaults, speed up
              decision-making, and keep your customers safe with explainable ML models.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                to="/signup"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700"
              >
                Apply Here
              </Link>
            
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
              <div className="text-sm text-gray-500">Recent Alerts</div>
              <ul className="mt-4 space-y-3">
                <li className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">High-risk application</div>
                    <div className="text-xs text-gray-500">User: johndoe • Score: 0.92</div>
                  </div>
                  <div className="text-xs text-red-600 font-semibold">Review</div>
                </li>
                <li className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Multiple SSNs</div>
                    <div className="text-xs text-gray-500">User: janedoe • Score: 0.78</div>
                  </div>
                  <div className="text-xs text-yellow-600 font-semibold">Investigate</div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="features" className="mt-20">
          <h2 className="text-2xl font-bold text-blue-600">Features</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow">
              <h3 className="font-semibold text-gray-900">Real-time scoring</h3>
              <p className="text-sm text-gray-700 mt-2">Score applications in milliseconds.</p>
            </div>
            <div className="p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow">
              <h3 className="font-semibold text-gray-900">Explainable AI</h3>
              <p className="text-sm text-gray-700 mt-2">See why a decision was made.</p>
            </div>
            <div className="p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow">
              <h3 className="font-semibold text-gray-900">Easy Apply</h3>
              <p className="text-sm text-gray-700 mt-2">Apply for loans easily and quickly.</p>
            </div>
          </div>
        </section>
      </main>

  <footer className="bg-white/80 border-t mt-16 relative z-40">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-black/90">© {new Date().getFullYear()} Edu-gate</div>
          <div className="mt-4 md:mt-0">
            <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md">
              Apply Here
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
