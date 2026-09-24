# Complete Deployment Guide - CardioVision AI (Vercel + Render)

This guide provides step-by-step instructions for deploying your Cardiovascular Risk Predictor project on **Render** (Backend) and **Vercel** (Frontend) without needing Docker.

---

## Repository Overview

```
├── backend/
│   ├── app.py                 # FastAPI application
│   ├── requirements.txt       # Python dependencies
│   ├── cardio_model.joblib    # Machine Learning model (35.7 MB compressed)
│   └── render.yaml            # Render blueprint configuration
├── frontend/
│   ├── src/                   # React components & styles
│   ├── package.json           # Node dependencies
│   ├── vercel.json            # Vercel SPA routing configuration
│   └── vite.config.js         # Vite bundler configuration
└── DEPLOYMENT.md              # Deployment instructions
```

> **Note on Model Size**: The original `cardio_model.pkl` was 225 MB (which exceeds GitHub's 100 MB single file limit). It has been losslessly compressed into `cardio_model.joblib` (35.7 MB) so it pushes smoothly to GitHub and loads fast in production.

---

## 1. Deploying the Backend on Render (Free Tier)

Render hosts Python FastAPI backends for free.

### Step-by-Step Instructions:

1. Push your latest code to your GitHub repository.

2. Go to **[Render Dashboard](https://dashboard.render.com)** and sign in.

3. Click **New +** -> **Web Service**.

4. Select **Build and deploy from a Git repository** and connect your GitHub repository.

5. Configure the service parameters:
   - **Name**: `cardiovision-backend` (or any custom name)
   - **Region**: Choose the closest location to your users (e.g. Singapore, Oregon, Frankfurt)
   - **Branch**: `main`
   - **Root Directory**: `backend` *(Crucial step!)*
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`

6. Click **Create Web Service**.

7. Wait 1–2 minutes for Render to build and start your application.
   Once deployed, Render will provide a live URL, for example:
   `https://cardiovision-backend.onrender.com`

8. **Test Backend Live**:
   - Health check URL: `https://cardiovision-backend.onrender.com/api/health`
   - Interactive Swagger API documentation: `https://cardiovision-backend.onrender.com/docs`

---

## 2. Deploying the Frontend on Vercel (Free Tier)

Vercel hosts React/Vite frontends with global CDN acceleration for free.

### Step-by-Step Instructions:

1. Go to **[Vercel Dashboard](https://vercel.com/dashboard)** and sign in.

2. Click **Add New...** -> **Project**.

3. Import your GitHub repository.

4. In the project configuration screen:
   - **Framework Preset**: `Vite` (auto-detected)
   - **Root Directory**: Click *Edit* and select `frontend` *(Crucial step!)*
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Expand **Environment Variables** and add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://cardio-vascular-backend.onrender.com` *(Replace with your exact Render backend URL from Step 1)*

6. Click **Deploy**.

7. In under 1 minute, Vercel will give you a live production URL, for example:
   `https://cardio-vascular.vercel.app`

---

## 3. Local Development Setup (Optional)

If you want to run the project locally on your machine:

### Backend (FastAPI):
```bash
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload
```
Access local backend at `http://localhost:8000`.

### Frontend (React + Vite):
```bash
cd frontend
npm install
npm run dev
```
Access local frontend at `http://localhost:5173`.

---

## 4. API Reference

### Health Check (`GET /api/health`)
Returns backend operational status and whether the ML model is loaded.

### Risk Prediction (`POST /api/predict`)
**Request Body**:
```json
{
  "age": 45,
  "gender": 2,
  "height": 168,
  "weight": 72,
  "ap_hi": 120,
  "ap_lo": 80,
  "cholesterol": 1,
  "gluc": 1,
  "smoke": 0,
  "alco": 0,
  "active": 1
}
```
**Response**: Returns risk assessment label, probability percentage, clinical metrics (BMI, MAP, BP stage), risk factors, and actionable medical recommendations.
