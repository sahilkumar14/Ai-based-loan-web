import React from "react";
import { Link } from "react-router-dom";
// use import.meta.url to build a reliable asset URL that works in dev and build
const bgImageUrl = new URL("../assets/2563.jpg", import.meta.url).href;

export default function Landing() {
  const bgStyle = {
    backgroundImage: `url(${bgImageUrl})`,
    backgroundSize: 'auto',
    backgroundPosition: 'center',
  };

  return (
    <div className="min-h-screen text-gray-800 relative bg-gray-50">
      {/* background image behind everything */}
      <div className="absolute inset-0 -z-10" style={bgStyle} aria-hidden />
      {/* overlay sits above image but behind content */}
      <div className="absolute inset-0 z-0 bg-black/10" aria-hidden />

  <main className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        {/* HERO */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-black leading-tight">
              Protect your lending business with
              <span className="text-blue-600 block">AI-powered fraud detection.</span>
            </h1>
            <p className="mt-4 text-lg text-black/90 max-w-2xl">
              Spot suspicious loan applications instantly. Reduce defaults, speed up
              decision-making, and keep your customers safe with explainable machine learning models and real-time scoring.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 items-center">
              <Link
                to="/signup"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 text-base"
              >
                Apply Now
              </Link>
              <Link
                to="/login"
                className="inline-block border border-gray-200 px-4 py-2 rounded-lg text-gray-800 bg-white text-sm"
              >
                Distributor Login
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 max-w-sm">
              <div className="p-3 bg-white/80 rounded-lg shadow text-center">
                <div className="text-xl font-bold">98%</div>
                <div className="text-xs text-gray-600">Fraud detection rate</div>
              </div>
              <div className="p-3 bg-white/80 rounded-lg shadow text-center">
                <div className="text-xl font-bold"><span>50ms</span></div>
                <div className="text-xs text-gray-600">Avg scoring latency</div>
              </div>
              <div className="p-3 bg-white/80 rounded-lg shadow text-center">
                <div className="text-xl font-bold">24/7</div>
                <div className="text-xs text-gray-600">Monitoring & alerts</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
              <div className="text-sm text-gray-500 font-medium">Recent Alerts</div>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full bg-red-500 mt-2" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">High-risk application detected</div>
                    <div className="text-xs text-gray-500">User: johndoe • Score: 0.92 • 2 min ago</div>
                  </div>
                  <div className="text-sm text-red-600 font-semibold">Review</div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 mt-2" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">Multiple identity hints</div>
                    <div className="text-xs text-gray-500">User: janedoe • Score: 0.78 • 10 min ago</div>
                  </div>
                  <div className="text-sm text-yellow-600 font-semibold">Investigate</div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full bg-green-400 mt-2" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">Low-risk approved</div>
                    <div className="text-xs text-gray-500">User: alice • Score: 0.12 • 1 hour ago</div>
                  </div>
                  <div className="text-sm text-green-600 font-semibold">Approved</div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="mt-12">
          <h2 className="text-2xl font-bold text-blue-600">Features</h2>
          <p className="mt-3 text-gray-700 max-w-2xl">Everything you need to detect and prevent lending fraud at scale.</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow">
              <h3 className="font-semibold text-gray-900 text-lg">Real-time scoring</h3>
              <p className="text-sm text-gray-700 mt-2">Score applications in milliseconds with minimal infrastructure cost.</p>
            </div>
            <div className="p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow">
              <h3 className="font-semibold text-gray-900 text-lg">Explainable AI</h3>
              <p className="text-sm text-gray-700 mt-2">Understand which signals influenced each decision for fast audits.</p>
            </div>
            <div className="p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow">
              <h3 className="font-semibold text-gray-900 text-lg">Custom rules & alerts</h3>
              <p className="text-sm text-gray-700 mt-2">Create business rules and notifications that suit your workflow.</p>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="mt-12">
          <h2 className="text-2xl font-bold">Trusted by lending teams</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white/90 rounded-lg shadow">
              <div className="text-sm font-semibold">"Reduced fraud cases by 40% in 3 months"</div>
              <div className="text-xs text-gray-500 mt-2">— Rohan, Ops Lead</div>
            </div>
            <div className="p-6 bg-white/90 rounded-lg shadow">
              <div className="text-sm font-semibold">"Fast and explainable scoring for compliance"</div>
              <div className="text-xs text-gray-500 mt-2">— Priya, Risk</div>
            </div>
            <div className="p-6 bg-white/90 rounded-lg shadow">
              <div className="text-sm font-semibold">"Seamless integration with our pipeline"</div>
              <div className="text-xs text-gray-500 mt-2">— Anand, CTO</div>
            </div>
          </div>
        </section>
      </main>


      <footer className="bg-white/80 border-t mt-24 relative z-40">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between">
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
