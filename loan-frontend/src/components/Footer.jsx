import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-4 text-center text-gray-600 mt-8">
      &copy; {new Date().getFullYear()} Digital India & Atmanirbhar Bharat | All rights reserved.
    </footer>
  );
}
