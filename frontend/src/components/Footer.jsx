import React from 'react';
import { Eye, ArrowUp } from 'lucide-react';

const scrollTo = (href) => {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top" style={{ gridTemplateColumns: '1.8fr 1fr' }}>
        <div className="footer-brand">
          <div className="footer-brand-title">
            <Eye size={22} color="#ec4899" />
            <span>CardioVision AI</span>
          </div>
          <p>
            An advanced machine-learning powered cardiovascular risk screening platform, engineered as a full-stack biomedical AI solution.
          </p>
        </div>

        <div className="footer-col">
          <h4>Navigation</h4>
          <button onClick={() => scrollTo('#features')}>Platform Features</button>
          <button onClick={() => scrollTo('#insights')}>Dataset Insights</button>
          <button onClick={() => scrollTo('#prediction-form')}>Clinical Assessment</button>
          <button onClick={() => scrollTo('#about')}>Architecture & Stack</button>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} CardioVision AI. Built for educational and research purposes — not a substitute for professional medical consultation.</p>
        <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
          <ArrowUp size={18} />
        </button>
      </div>
    </footer>
  );
}
