import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Heart, Printer, Stethoscope, ChevronRight, Activity, Sparkles } from 'lucide-react';
import RiskMeter from './RiskMeter';

export default function ResultCard({ result }) {
  if (!result) {
    return (
      <div className="glass-card result-card" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '480px' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: 'rgba(99, 102, 241, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          border: '1px solid rgba(99, 102, 241, 0.2)'
        }}>
          <Heart size={36} color="#818cf8" style={{ animation: 'heartPulse 2.5s infinite ease-in-out' }} />
        </div>
        <h3 style={{ fontSize: '1.3rem', color: '#f8fafc', marginBottom: '8px' }}>Ready for Analysis</h3>
        <p style={{ fontSize: '0.9rem', color: '#94a3b8', maxWidth: '320px', lineHeight: '1.6' }}>
          Fill in patient clinical parameters or select a sample preset to generate an instant CardioVision evaluation.
        </p>
      </div>
    );
  }

  const isHighRisk = result.prediction === 1;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="glass-card result-card">
      {/* Risk Banner */}
      <div className={`result-banner ${isHighRisk ? 'danger' : 'success'}`}>
        <div className="banner-icon">
          {isHighRisk ? <ShieldAlert size={28} /> : <CheckCircle2 size={28} />}
        </div>
        <div className="banner-text">
          <h3>{result.risk_label}</h3>
          <p>
            {isHighRisk
              ? 'CardioVision AI identified elevated indicators correlating with cardiovascular disease risk.'
              : 'Clinical parameters are within favorable ranges with low cardiovascular disease probability.'}
          </p>
        </div>
      </div>

      {/* Radial Risk Meter */}
      <RiskMeter probability={result.risk_probability} isHighRisk={isHighRisk} />

      {/* Metrics Breakdown Grid */}
      <div className="metrics-grid">
        <div className="metric-box">
          <div className="metric-label">Body Mass Index (BMI)</div>
          <div className="metric-val">{result.metrics.bmi} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#94a3b8' }}>kg/m²</span></div>
          <div className="metric-sub">{result.metrics.bmi_category}</div>
        </div>

        <div className="metric-box">
          <div className="metric-label">Blood Pressure Status</div>
          <div className="metric-val" style={{ fontSize: '1.05rem' }}>{result.metrics.bp_category}</div>
          <div className="metric-sub">Mean Arterial: {result.metrics.mean_arterial_pressure} mmHg</div>
        </div>
      </div>

      {/* Risk Factors */}
      {result.risk_factors && result.risk_factors.length > 0 && (
        <div className="details-section">
          <h4>
            <AlertTriangle size={16} color="#ef4444" /> Significant Clinical Factors
          </h4>
          <div className="factor-tags">
            {result.risk_factors.map((factor, idx) => (
              <span key={idx} className="factor-tag">
                {factor}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div className="details-section">
          <h4>
            <Stethoscope size={16} color="#6366f1" /> Personalized Clinical Guidance
          </h4>
          <ul className="recommendations-list">
            {result.recommendations.map((rec, idx) => (
              <li key={idx}>
                <ChevronRight size={15} />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handlePrint} className="print-btn" type="button">
        <Printer size={18} /> Print Health Summary Report
      </button>
    </div>
  );
}
