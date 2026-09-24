import os
import pathlib
import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="Cardiovascular Disease Risk Prediction API",
    description="Machine Learning API to predict cardiovascular risk based on patient clinical parameters.",
    version="1.0.0"
)

# Enable CORS for React Frontend (allows all origins in dev & production flexibility)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Locate and load model (cardio_model.joblib or cardio_model.pkl)
MODEL = None

def load_model():
    global MODEL
    possible_paths = [
        pathlib.Path(__file__).parent / "cardio_model.joblib",
        pathlib.Path(__file__).parent / "cardio_model.pkl",
        pathlib.Path(__file__).parent.parent / "cardio_model.joblib",
        pathlib.Path(__file__).parent.parent / "cardio_model.pkl",
        pathlib.Path("cardio_model.joblib"),
        pathlib.Path("cardio_model.pkl"),
    ]
    for p in possible_paths:
        if p.exists():
            print(f"Loading model from {p.resolve()}...")
            MODEL = joblib.load(p)
            return
    raise FileNotFoundError("Model file (cardio_model.joblib or cardio_model.pkl) could not be found.")

@app.on_event("startup")
def startup_event():
    load_model()

class CardioInput(BaseModel):
    age: float = Field(..., ge=1, le=120, description="Age in years")
    gender: int = Field(..., ge=1, le=2, description="1: Female, 2: Male")
    height: float = Field(..., ge=50, le=250, description="Height in cm")
    weight: float = Field(..., ge=20, le=300, description="Weight in kg")
    ap_hi: int = Field(..., ge=50, le=250, description="Systolic blood pressure (mmHg)")
    ap_lo: int = Field(..., ge=30, le=200, description="Diastolic blood pressure (mmHg)")
    cholesterol: int = Field(..., ge=1, le=3, description="1: Normal, 2: Above Normal, 3: Well Above Normal")
    gluc: int = Field(..., ge=1, le=3, description="1: Normal, 2: Above Normal, 3: Well Above Normal")
    smoke: int = Field(..., ge=0, le=1, description="0: No, 1: Yes")
    alco: int = Field(..., ge=0, le=1, description="0: No, 1: Yes")
    active: int = Field(..., ge=0, le=1, description="0: No, 1: Yes")

def get_bp_category(sys: int, dia: int) -> str:
    if sys >= 180 or dia >= 120:
        return "Hypertensive Crisis"
    elif sys >= 140 or dia >= 90:
        return "Stage 2 Hypertension"
    elif sys >= 130 or dia >= 80:
        return "Stage 1 Hypertension"
    elif sys >= 120 and dia < 80:
        return "Elevated Blood Pressure"
    elif sys < 120 and dia < 80:
        return "Normal Blood Pressure"
    return "Suboptimal"

def get_bmi_category(bmi: float) -> str:
    if bmi < 18.5:
        return "Underweight"
    elif 18.5 <= bmi < 25.0:
        return "Normal Weight"
    elif 25.0 <= bmi < 30.0:
        return "Overweight"
    else:
        return "Obese"

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "model_loaded": MODEL is not None,
        "model_type": type(MODEL).__name__ if MODEL else None
    }

@app.post("/api/predict")
def predict(data: CardioInput):
    if MODEL is None:
        load_model()
        if MODEL is None:
            raise HTTPException(status_code=500, detail="Model is not loaded.")

    # Convert age from years to days as expected by dataset
    age_days = float(round(data.age * 365.25))

    # Construct input dataframe matching exact feature names
    features = pd.DataFrame([{
        "age": age_days,
        "gender": data.gender,
        "height": data.height,
        "weight": data.weight,
        "ap_hi": data.ap_hi,
        "ap_lo": data.ap_lo,
        "cholesterol": data.cholesterol,
        "gluc": data.gluc,
        "smoke": data.smoke,
        "alco": data.alco,
        "active": data.active
    }])

    # Make prediction
    prediction = int(MODEL.predict(features)[0])
    
    # Calculate probability if model supports predict_proba
    if hasattr(MODEL, "predict_proba"):
        probabilities = MODEL.predict_proba(features)[0]
        risk_proba = float(round(probabilities[1] * 100, 1))
    else:
        risk_proba = 100.0 if prediction == 1 else 0.0

    # Clinical metric calculations
    height_m = data.height / 100.0
    bmi = round(data.weight / (height_m ** 2), 1)
    bmi_cat = get_bmi_category(bmi)
    bp_cat = get_bp_category(data.ap_hi, data.ap_lo)
    mean_arterial_pressure = round(data.ap_lo + (data.ap_hi - data.ap_lo) / 3.0, 1)

    # Risk factor identification
    risk_factors = []
    if data.ap_hi >= 130 or data.ap_lo >= 80:
        risk_factors.append(f"Elevated Blood Pressure ({data.ap_hi}/{data.ap_lo} mmHg)")
    if data.cholesterol > 1:
        level_str = "Above Normal" if data.cholesterol == 2 else "Well Above Normal"
        risk_factors.append(f"High Cholesterol ({level_str})")
    if data.gluc > 1:
        level_str = "Above Normal" if data.gluc == 2 else "Well Above Normal"
        risk_factors.append(f"Elevated Glucose ({level_str})")
    if bmi >= 25.0:
        risk_factors.append(f"High Body Mass Index ({bmi} kg/m² - {bmi_cat})")
    if data.smoke == 1:
        risk_factors.append("Tobacco Smoking")
    if data.alco == 1:
        risk_factors.append("Alcohol Consumption")
    if data.active == 0:
        risk_factors.append("Physical Inactivity")

    # Tailored clinical recommendations
    recommendations = []
    if data.ap_hi >= 130 or data.ap_lo >= 80:
        recommendations.append("Monitor blood pressure regularly and consult a physician for a DASH diet or antihypertensive evaluation.")
    if data.cholesterol > 1:
        recommendations.append("Reduce intake of saturated fats and consider lipid panel evaluation with a physician.")
    if data.gluc > 1:
        recommendations.append("Limit refined sugars and consult a healthcare provider for fasting glucose monitoring.")
    if bmi >= 25.0:
        recommendations.append("Incorporate caloric management and structured physical exercise to reach a target BMI < 25.")
    if data.smoke == 1:
        recommendations.append("Smoking significantly increases vascular resistance; seek smoking cessation support.")
    if data.active == 0:
        recommendations.append("Engage in at least 150 minutes of moderate-intensity aerobic exercise per week.")
    if not recommendations:
        recommendations.append("Maintain your healthy lifestyle with balanced nutrition, regular exercise, and routine checkups.")

    return {
        "prediction": prediction,
        "risk_label": "High Cardiovascular Risk" if prediction == 1 else "Low Cardiovascular Risk",
        "risk_probability": risk_proba,
        "status_color": "danger" if prediction == 1 else "success",
        "metrics": {
            "bmi": bmi,
            "bmi_category": bmi_cat,
            "bp_category": bp_cat,
            "mean_arterial_pressure": mean_arterial_pressure,
            "pulse_pressure": data.ap_hi - data.ap_lo
        },
        "risk_factors": risk_factors,
        "recommendations": recommendations
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
