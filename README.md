# Ai-based-loan-web

# 🎓 Credify — Smart Loan & Fraud Detection Platform

Credify is a full-stack web application that helps **students apply for education loans** while enabling **distributors (loan officers)** to detect **fraudulent or suspicious behavior** using **AI-driven behavioral analytics**.

---

## 🚀 Overview

### 🎯 Purpose
- **Students** can apply for loans easily through an intuitive dashboard.  
- **Distributors** can review loan applications and check for **fraud risk** based on real-time **behavioral data** (like typing patterns, mouse activity, and click behavior).

This project integrates **behavioral analysis** into the loan process to detect fake applications, identity theft, and bots — **while keeping the experience smooth for genuine users.**

---

## 🧩 Features

### 👨‍🎓 Student Side
- Register and log in securely  
- Apply for educational loans with required details  
- Real-time **behavioral data collection**:
  - Typing speed  
  - Hesitation time  
  - Error count  
  - Mouse movement distance  
  - Scroll activity  
  - Click pattern variability  
- Behavior data is sent to backend for **fraud risk scoring**

### 🧾 Distributor Side
- Login with distributor credentials  
- View all loan applications  
- Access **behavioral risk scores** for each applicant  
- Identify suspicious applications quickly using fraud probability analysis

### 🤖 Behavioral Analytics
- Frontend tracks user interactions
- FastAPI backend processes data
- AI/logic assigns a **fraud risk level (Low / Medium / High)**  
- Distributors can take action accordingly

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js (Vite or CRA) |
| **Backend** | FastAPI (Python) |
| **Database** | PostgreSQL (for storing loan and behavior data) |
| **AI / Analysis** | Custom Python logic or ML model (future enhancement) |
| **Hosting** | Frontend - Vercel / Netlify; Backend - Render / Railway / Localhost |

---

## ⚙️ Project Structure

Credify/
│
├── frontend/ # React app
│ ├── src/
│ │ ├── pages/
│ │ │ ├── Landing.jsx
│ │ │ ├── Login.jsx
│ │ │ ├── Signup.jsx
│ │ │ ├── StudentDashboard.jsx
│ │ │ └── DistributorDashboard.jsx
│ │ ├── components/
│ │ └── utils/behaviorAPI.js
│ └── package.json
│
├── backend/ # FastAPI app
│ ├── main.py
│ ├── models.py (if using SQLAlchemy)
│ ├── database.py
│ └── requirements.txt
│
└── README.md


