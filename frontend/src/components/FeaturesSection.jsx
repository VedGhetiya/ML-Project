import React from 'react';
import { Zap, LineChart, ShieldCheck, Brain } from 'lucide-react';

const features = [
  {
    title: 'Instant Precision Predictions',
    icon: Zap,
    accent: '#6366f1',
    desc: 'Receive comprehensive cardiovascular risk probabilities in sub-second inference speed.',
  },
  {
    title: 'Actionable Clinical Insights',
    icon: LineChart,
    accent: '#ec4899',
    desc: 'Automated BMI calculation, AHA blood-pressure classification, and lifestyle guidance.',
  },
  {
    title: 'Trained on Real Patient Data',
    icon: Brain,
    accent: '#8b5cf6',
    desc: 'High-performing Random Forest classifier trained on 70,000+ clinical cohort examinations.',
  },
  {
    title: 'Private & Secure Inference',
    icon: ShieldCheck,
    accent: '#10b981',
    desc: 'Client-side encrypted payload transport with no patient data retention or telemetry.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="features" id="features">
      <div className="section-heading">
        <span className="eyebrow">Platform Capabilities</span>
        <h2>Why Choose CardioVision?</h2>
        <p className="section-sub">
          Engineered to bridge clinical data science with accessible, intuitive preventive screening.
        </p>
      </div>
      <div className="feature-grid">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="feature-card glass-card">
              <div className="feature-icon" style={{ '--accent': f.accent }}>
                <Icon size={24} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
