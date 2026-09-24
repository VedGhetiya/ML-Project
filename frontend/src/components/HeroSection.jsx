import React from 'react';
import { ArrowRight, BarChart3 } from 'lucide-react';

const STATS = [
  { value: '70,000+', label: 'Clinical Records' },
  { value: '73.4%', label: 'Model Accuracy' },
  { value: '11', label: 'Biomarkers' },
  { value: '< 200ms', label: 'Inference Speed' },
];

export default function HeroSection() {
  const scrollToForm = () => {
    const el = document.getElementById('prediction-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToInsights = () => {
    const el = document.getElementById('insights');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />

      <div className="hero-ecg" aria-hidden="true">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <polyline
            className="ecg-line"
            fill="none"
            points="0,60 120,60 150,60 170,20 190,100 210,10 230,90 250,60 340,60 360,60 380,30 400,60 480,60 500,60 520,20 540,100 560,10 580,90 600,60 690,60 710,60 730,30 750,60 830,60 850,60 870,20 890,100 910,10 930,90 950,60 1040,60 1060,60 1080,30 1100,60 1200,60"
          />
        </svg>
      </div>

      <div className="hero-content">
        <div className="hero-badge">
          <span className="pulse-dot" />
          <span>Next-Gen Machine Learning · Clinical Cardiovascular Model</span>
        </div>

        <h1>Clear Vision into Your Cardiovascular Health</h1>
        <p>
          CardioVision AI translates eleven essential clinical parameters into real-time, precision risk insights — powered by an ensemble Random Forest model trained on 70,000+ validated patient records.
        </p>

        <div className="hero-actions">
          <button className="cta-btn" onClick={scrollToForm}>
            Launch Live Assessment <ArrowRight size={18} />
          </button>
          <button className="cta-btn-outline" onClick={scrollToInsights}>
            <BarChart3 size={18} /> Explore Data Insights
          </button>
        </div>

        <div className="hero-stats">
          {STATS.map((s) => (
            <div key={s.label} className="hero-stat">
              <div className="hero-stat-value">{s.value}</div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
