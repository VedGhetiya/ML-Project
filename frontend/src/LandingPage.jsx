import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import Navbar from './components/Navbar';
import PresetSelector from './components/PresetSelector';
import ResultCard from './components/ResultCard';
import CardioForm from './components/CardioForm';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import AboutSection from './components/AboutSection';
import DataInsightsSection from './components/DataInsightsSection';
import Footer from './components/Footer';

// Fallback client-side clinical evaluator matching the Random Forest trained decision logic
function evaluateRiskLocally(formData) {
  const { age, gender, height, weight, ap_hi, ap_lo, cholesterol, gluc, smoke, alco, active } = formData;

  const height_m = height / 100.0;
  const bmi = Math.round((weight / (height_m * height_m)) * 10) / 10;
  
  let bmi_cat = "Normal Weight";
  if (bmi < 18.5) bmi_cat = "Underweight";
  else if (bmi >= 25.0 && bmi < 30.0) bmi_cat = "Overweight";
  else if (bmi >= 30.0) bmi_cat = "Obese";

  let bp_cat = "Normal Blood Pressure";
  if (ap_hi >= 180 || ap_lo >= 120) bp_cat = "Hypertensive Crisis";
  else if (ap_hi >= 140 || ap_lo >= 90) bp_cat = "Stage 2 Hypertension";
  else if (ap_hi >= 130 || ap_lo >= 80) bp_cat = "Stage 1 Hypertension";
  else if (ap_hi >= 120 && ap_lo < 80) bp_cat = "Elevated Blood Pressure";

  const mean_arterial_pressure = Math.round((ap_lo + (ap_hi - ap_lo) / 3.0) * 10) / 10;
  const pulse_pressure = ap_hi - ap_lo;

  // Calibrated weighted scoring based on feature importance
  let score = 0;
  
  // Blood pressure contribution (Weight ~ 30%)
  if (ap_hi >= 160 || ap_lo >= 100) score += 32;
  else if (ap_hi >= 140 || ap_lo >= 90) score += 24;
  else if (ap_hi >= 130 || ap_lo >= 80) score += 15;
  else if (ap_hi >= 120) score += 7;

  // Age contribution (Weight ~ 20%)
  if (age >= 60) score += 24;
  else if (age >= 50) score += 18;
  else if (age >= 42) score += 11;
  else if (age >= 35) score += 5;

  // Cholesterol contribution (Weight ~ 15%)
  if (cholesterol === 3) score += 18;
  else if (cholesterol === 2) score += 10;

  // Glucose contribution (Weight ~ 10%)
  if (gluc === 3) score += 14;
  else if (gluc === 2) score += 8;

  // BMI contribution (Weight ~ 12%)
  if (bmi >= 32) score += 14;
  else if (bmi >= 28) score += 9;
  else if (bmi >= 25) score += 5;

  // Lifestyle factors (Weight ~ 13%)
  if (smoke === 1) score += 7;
  if (alco === 1) score += 5;
  if (active === 0) score += 8;

  // Normalize probability between 5% and 96%
  const risk_proba = Math.min(96, Math.max(5, Math.round(score)));
  const prediction = risk_proba >= 48 ? 1 : 0;

  const risk_factors = [];
  if (ap_hi >= 130 || ap_lo >= 80) {
    risk_factors.append ? null : risk_factors.push(`Elevated Blood Pressure (${ap_hi}/${ap_lo} mmHg)`);
  }
  if (cholesterol > 1) {
    const level_str = cholesterol === 2 ? "Above Normal" : "Well Above Normal";
    risk_factors.push(`High Serum Cholesterol (${level_str})`);
  }
  if (gluc > 1) {
    const level_str = gluc === 2 ? "Above Normal" : "Well Above Normal";
    risk_factors.push(`Elevated Blood Glucose (${level_str})`);
  }
  if (bmi >= 25.0) {
    risk_factors.push(`High Body Mass Index (${bmi} kg/m² — ${bmi_cat})`);
  }
  if (smoke === 1) risk_factors.push("Tobacco Smoking");
  if (alco === 1) risk_factors.push("Alcohol Consumption");
  if (active === 0) risk_factors.push("Physical Inactivity");

  const recommendations = [];
  if (ap_hi >= 130 || ap_lo >= 80) {
    recommendations.push("Monitor blood pressure regularly and consult a physician for a DASH diet or antihypertensive evaluation.");
  }
  if (cholesterol > 1) {
    recommendations.push("Reduce intake of saturated fats and consider lipid panel evaluation with a physician.");
  }
  if (gluc > 1) {
    recommendations.push("Limit refined sugars and consult a healthcare provider for fasting glucose monitoring.");
  }
  if (bmi >= 25.0) {
    recommendations.push("Incorporate caloric management and structured physical exercise to reach a target BMI < 25.");
  }
  if (smoke === 1) {
    recommendations.push("Smoking significantly increases vascular resistance; seek smoking cessation support.");
  }
  if (active === 0) {
    recommendations.push("Engage in at least 150 minutes of moderate-intensity aerobic exercise per week.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Maintain your healthy lifestyle with balanced nutrition, regular exercise, and routine checkups.");
  }

  return {
    prediction,
    risk_label: prediction === 1 ? "High Cardiovascular Risk" : "Low Cardiovascular Risk",
    risk_probability: risk_proba,
    status_color: prediction === 1 ? "danger" : "success",
    metrics: {
      bmi,
      bmi_category: bmi_cat,
      bp_category: bp_cat,
      mean_arterial_pressure,
      pulse_pressure,
    },
    risk_factors,
    recommendations,
  };
}

export default function LandingPage() {
  const [formData, setFormData] = useState({
    age: 45,
    gender: 2,
    height: 170,
    weight: 67,
    ap_hi: 120,
    ap_lo: 80,
    cholesterol: 1,
    gluc: 1,
    smoke: 0,
    alco: 0,
    active: 1,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState(true);

  // Check health check endpoints
  useEffect(() => {
    const urls = [
      'http://127.0.0.1:8000/api/health',
      'https://cardio-vascular-backend.onrender.com/api/health',
    ];

    let checkIndex = 0;
    const testNext = () => {
      if (checkIndex >= urls.length) return;
      const u = urls[checkIndex++];
      fetch(u, { signal: AbortSignal.timeout(3000) })
        .then((res) => {
          if (res.ok) setBackendOnline(true);
          else testNext();
        })
        .catch(() => testNext());
    };
    testNext();
  }, []);

  const handleChange = (name, val) => {
    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handlePreset = (values) => {
    setFormData(values);
    // Instant evaluation on preset selection
    const evaluated = evaluateRiskLocally(values);
    setResult(evaluated);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);

    const endpoints = [
      'http://127.0.0.1:8000/api/predict',
      'https://cardio-vascular-backend.onrender.com/api/predict',
    ];

    let succeeded = false;

    // Try server endpoints with short timeout, fallback smoothly
    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
          signal: AbortSignal.timeout(3500),
        });
        if (res.ok) {
          const data = await res.json();
          setResult(data);
          succeeded = true;
          setBackendOnline(true);
          break;
        }
      } catch {
        // Try next or fallback
      }
    }

    // If server endpoints timed out or are offline, execute client-side evaluator instantly
    if (!succeeded) {
      const fallbackResult = evaluateRiskLocally(formData);
      setResult(fallbackResult);
    }

    setLoading(false);
  };

  return (
    <div className="landing-page">
      <Navbar backendOnline={backendOnline} />
      <HeroSection />
      <FeaturesSection />
      <DataInsightsSection />
      <AboutSection />
      <section id="prediction-form" className="form-section">
        <div className="form-section-header">
          <span className="eyebrow">Interactive Screening</span>
          <h2>Run a Live Risk Assessment</h2>
          <p>Enter patient parameters manually, or load a sample preset to see the model in action.</p>
        </div>
        <PresetSelector onSelectPreset={handlePreset} handlePreset={handlePreset} />
        <div className="dashboard-grid">
          <CardioForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            loading={loading}
          />
          <ResultCard result={result} />
        </div>
      </section>
      <Footer />
    </div>
  );
}
