import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

const STACK = ['Python 3.11', 'Scikit-Learn', 'FastAPI', 'React 19', 'Vite 8', 'Recharts'];

export default function AboutSection() {
  const scrollToForm = () => {
    const el = document.getElementById('prediction-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="about" id="about">
      <div className="section-heading">
        <span className="eyebrow">Architecture & Technology</span>
        <h2>Under the Hood</h2>
      </div>
      <p>
        CardioVision AI leverages a finely tuned Random Forest ensemble classifier trained on the extensive Kaggle Cardiovascular Disease dataset. The architecture analyzes demographic variables, hemodynamics (systolic & diastolic blood pressure), biochemical markers (cholesterol & glucose levels), and behavioral indicators (smoking, alcohol consumption, and physical activity) to deliver calibrated risk probabilities and contextual clinical feedback.
      </p>

      <div className="stack-chips">
        {STACK.map((tech) => (
          <span key={tech} className="stack-chip">{tech}</span>
        ))}
      </div>

      <div className="about-links">
        <button onClick={scrollToForm} className="link-btn">
          <Sparkles size={18} /> Start Free Risk Assessment <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}
