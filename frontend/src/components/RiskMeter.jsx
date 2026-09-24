import React from 'react';

export default function RiskMeter({ probability, isHighRisk }) {
  const size = 190;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (probability / 100) * circumference;

  // Determine vibrant accent color based on probability
  let strokeColor = '#10b981'; // Emerald
  if (probability >= 35 && probability < 65) {
    strokeColor = '#f59e0b'; // Amber
  } else if (probability >= 65) {
    strokeColor = '#ef4444'; // Rose / Red
  }

  return (
    <div className="gauge-wrapper">
      <svg width={size} height={size} className="gauge-svg">
        <circle
          className="gauge-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <circle
          className="gauge-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="gauge-center-content">
        <div className="gauge-val" style={{ color: strokeColor }}>
          {probability}%
        </div>
        <div className="gauge-lbl">Risk Probability</div>
      </div>
    </div>
  );
}
