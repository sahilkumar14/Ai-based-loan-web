import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from 'react-webcam'; // Import the Webcam component
import bgImage from "../assets/2563.jpg";

export default function Signup({ setUser, setRole }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  
  // Use a boolean state to control the visibility of the Webcam component
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [photoData, setPhotoData] = useState(null); // base64 string
  
  // Ref for the Webcam component
  const webcamRef = useRef(null);

  // Constraints for the camera
  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user"
  };

  // CSS style to mirror the video preview horizontally
  const mirroredStyle = {
    transform: 'scaleX(-1)'
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Reset photo data if the role changes from student to something else
    if (e.target.name === 'role' && e.target.value !== 'student') {
      setPhotoData(null);
      stopCamera();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    stopCamera(); // Stop camera just in case it was left open
    try {
      // include captured photo when present (student)
      const payload = { ...form };
      if (form.role === 'student' && photoData) {
         payload.photo = photoData;
      }
      
      // ... (Rest of the fetch logic is the same)
      const res = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      alert(data.message || "Account created");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  // Function to capture the image using react-webcam's getScreenshot method
  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      // getScreenshot returns a base64 string directly
      const imageSrc = webcamRef.current.getScreenshot(); 
      if (imageSrc) {
        // Compress/resize before setting state and stopping the camera
        compressAndResizeDataUrl(imageSrc).then((small) => setPhotoData(small));
      }
      stopCamera();
    }
  }, [webcamRef]);

  // Function to activate the webcam
  const startCamera = () => {
    // react-webcam handles the getUserMedia call internally when it mounts
    setIsWebcamActive(true);
  };
  
  // Function to explicitly stop the camera stream
  const stopCamera = () => {
    // Setting isWebcamActive to false unmounts the Webcam component, 
    // which automatically stops the media stream.
    setIsWebcamActive(false); 
  };
  
  // Optional: Clean up stream on component unmount (Webcam component does this, but good practice)
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // --- File input fallback & compression helper (kept the same) ---
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      const small = await compressAndResizeDataUrl(dataUrl);
      setPhotoData(small);
    };
    reader.readAsDataURL(f);
  };

  // Resize/compress any dataURL image to reasonable size for upload (kept the same)
  const compressAndResizeDataUrl = (dataUrl, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const ratio = img.width > maxWidth ? maxWidth / img.width : 1;
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        // convert to JPEG for compression (smaller than PNG)
        const out = canvas.toDataURL('image/jpeg', quality);
        resolve(out);
      };
      img.onerror = () => resolve(dataUrl); // on error, return original
      img.src = dataUrl;
    });
  };
  // -----------------------------------------------------------------

  const bgStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="min-h-screen relative py-6">
      <div className="absolute inset-0 -z-10" style={bgStyle} aria-hidden />
      <div className="absolute inset-0 z-0 bg-black/8" aria-hidden />
      <div className="flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 relative z-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-0">Create an account</h1>
          <p className="text-sm text-gray-500 mb-4">Start applying with a new account</p>


          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Input fields remain the same */}
            <div className="relative">
              <input name="full_name" value={form.fullname} onChange={handleChange} placeholder=" " className="peer w-full border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200" required />
              <label className="absolute left-3 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-0.6rem] peer-focus:text-xs peer-focus:text-blue-600 bg-white px-1">Full name</label>
            </div>
            <div className="relative">
              <input name="email" value={form.email} onChange={handleChange} placeholder=" " className="peer w-full border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200" required />
              <label className="absolute left-3 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-0.6rem] peer-focus:text-xs peer-focus:text-blue-600 bg-white px-1">Email</label>
            </div>
            <div className="relative">
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder=" " className="peer w-full border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200" required />
              <label className="absolute left-3 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-0.6rem] peer-focus:text-xs peer-focus:text-blue-600 bg-white px-1">Password</label>
            </div>

            {/* Role select remains the same */}
            <div>
              <label className="text-sm text-gray-600">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="w-full mt-2 border border-gray-200 p-3 rounded-md">
                <option value="student">Student</option>
                <option value="distributor">Distributor</option>
              </select>
            </div>

            {form.role === 'student' && (
              <div className="space-y-2">
                {/* 1. Initial state: Show buttons for Camera or File Upload (FALLBACK) */}
                {!photoData && !isWebcamActive && (
                  <>
                    <button type="button" onClick={startCamera} className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">Open camera to capture photo</button>
                    <div className="text-center text-sm text-gray-500">or</div>
                    <div>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
                    </div>
                  </>
                )}

                {/* 2. Webcam Active state: Show live feed and capture controls */}
                {isWebcamActive && (
                  <div className="space-y-2">
                    <div className="w-full rounded border overflow-hidden">
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg" 
                        videoConstraints={videoConstraints}
                        className="w-full h-56 object-cover"
                        // FIX: Apply CSS transform to mirror the preview horizontally
                        style={mirroredStyle} 
                        onUserMediaError={(error) => {
                          console.error("Camera access failed:", error);
                          alert('Could not open camera. Please check permissions or upload a file.');
                          stopCamera(); 
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={capturePhoto} className="flex-1 bg-indigo-600 text-white py-2 rounded-md">Capture</button>
                      <button type="button" onClick={stopCamera} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md">Cancel</button>
                    </div>
                  </div>
                )}

                {/* 3. Photo Captured state: Show captured image and controls */}
                {photoData && (
                  <div className="space-y-2">
                    <img src={photoData} alt="captured" className="w-full rounded border" style={mirroredStyle} />
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setPhotoData(null)} className="flex-1 bg-yellow-100 text-yellow-800 py-2 rounded-md">Retake</button>
                      <button type="button" onClick={() => { /* keep photo */ }} className="flex-1 bg-green-100 text-green-800 py-2 rounded-md">Keep</button>
                    </div>
                  </div>
                )}
              </div>
            )}
            

            <button
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              disabled={form.role === 'student' && !photoData}
            >
              Create account
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-4">
            Already have an account? <a href="/login" className="text-blue-600">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}