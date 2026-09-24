# 🫀 CardioVision AI — Predictive Cardiovascular Intelligence Platform

A full-stack machine learning web application that predicts cardiovascular disease risk based on clinical health parameters using Random Forest machine learning, delivering instant clinical analysis, metric calculations, and personalized health recommendations.

---

## 🌟 Key Features

- **Machine Learning Powered**: Uses a trained Random Forest model to compute personalized cardiovascular risk probability.
- **Clinical Biomarkers Analysis**: Calculates Body Mass Index (BMI), Mean Arterial Pressure (MAP), Pulse Pressure, and Blood Pressure Staging according to AHA guidelines.
- **Instant Risk Assessment**: Categorizes patients into Low Risk or High Risk with visual urgency indicators.
- **Personalized Recommendations**: Generates tailored clinical guidance based on individual risk factors (hypertension, high cholesterol, smoking, sedentary lifestyle, etc.).
- **Modern Responsive UI**: Built with React, Vite, Lucide Icons, and Glassmorphism styling.
- **Fast & Lightweight Backend**: Built with Python FastAPI, Uvicorn, and compressed Joblib model serialization.

---

## 📁 Repository Structure

```
├── backend/
│   ├── app.py                 # FastAPI prediction server
│   ├── requirements.txt       # Python dependencies
│   ├── cardio_model.joblib    # ML Model file (35.7 MB)
│   └── render.yaml            # Render deployment blueprint
├── frontend/
│   ├── src/                   # React components, presets, and styling
│   ├── package.json           # Frontend dependencies
│   └── vercel.json            # Vercel SPA routing
└── DEPLOYMENT.md              # Complete Vercel & Render deployment guide
```

---

## 🚀 Easy Deployment (Render + Vercel)

For step-by-step instructions on deploying the **Backend on Render** and **Frontend on Vercel**, see the **[DEPLOYMENT.md](DEPLOYMENT.md)** guide.

- **Backend Deployment**: Render (Root directory: `backend`)
- **Frontend Deployment**: Vercel (Root directory: `frontend`, Env: `VITE_API_URL`)

---

## 💻 Quick Local Setup

### 1. Backend API:
```bash
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend App:
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.
