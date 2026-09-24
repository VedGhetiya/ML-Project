import React from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts';
import { Activity, TrendingUp } from 'lucide-react';

/* Custom Tooltip */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ color: entry.color || '#38bdf8' }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* Normalize values 0–100 for radar chart */
function buildRadarData(formData) {
  return [
    { metric: 'Blood Pressure', value: Math.min(100, Math.round(((formData.ap_hi - 90) / 110) * 100)), fullMark: 100 },
    { metric: 'Cholesterol', value: formData.cholesterol === 1 ? 20 : formData.cholesterol === 2 ? 60 : 95, fullMark: 100 },
    { metric: 'Glucose', value: formData.gluc === 1 ? 20 : formData.gluc === 2 ? 60 : 95, fullMark: 100 },
    { metric: 'BMI Risk', value: Math.min(100, Math.round(((formData.weight / ((formData.height / 100) ** 2)) - 15) / 25 * 100)), fullMark: 100 },
    { metric: 'Smoking', value: formData.smoke === 1 ? 85 : 10, fullMark: 100 },
    { metric: 'Activity', value: formData.active === 1 ? 15 : 80, fullMark: 100 },
    { metric: 'Age Risk', value: Math.min(100, Math.round(((formData.age - 20) / 50) * 100)), fullMark: 100 },
  ];
}

/* Build comparison bar data */
function buildComparisonData(formData) {
  const bmi = (formData.weight / ((formData.height / 100) ** 2)).toFixed(1);
  return [
    { param: 'Systolic BP', patient: formData.ap_hi, normal: 120, unit: 'mmHg' },
    { param: 'Diastolic BP', patient: formData.ap_lo, normal: 80, unit: 'mmHg' },
    { param: 'BMI', patient: parseFloat(bmi), normal: 22.5, unit: 'kg/m²' },
    { param: 'Age Factor', patient: Math.min(formData.age, 80), normal: 40, unit: 'years' },
  ];
}

export default function PatientCharts({ formData, result }) {
  if (!result) return null;

  const radarData = buildRadarData(formData);
  const comparisonData = buildComparisonData(formData);
  const isHighRisk = result.prediction === 1;

  return (
    <div className="patient-charts-section">
      <div className="charts-grid charts-grid-2col">
        {/* Radar: Patient Risk Profile */}
        <div className="glass-card chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <Activity size={18} color={isHighRisk ? '#ef4444' : '#10b981'} />
              <h3>Patient Risk Profile</h3>
            </div>
            <p className="chart-card-desc">Higher values indicate greater risk contribution per factor</p>
          </div>
          <div className="chart-card-body">
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="72%">
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                <Radar
                  name="Risk Level"
                  dataKey="value"
                  stroke={isHighRisk ? '#ef4444' : '#10b981'}
                  fill={isHighRisk ? '#ef4444' : '#10b981'}
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar: Patient vs Normal Ranges */}
        <div className="glass-card chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <TrendingUp size={18} color="#38bdf8" />
              <h3>Patient vs Normal Values</h3>
            </div>
            <p className="chart-card-desc">Side-by-side comparison of patient values against healthy baselines</p>
          </div>
          <div className="chart-card-body">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={comparisonData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="param" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="normal" name="Normal" fill="#10b981" radius={[6, 6, 0, 0]} barSize={24} fillOpacity={0.7} />
                <Bar dataKey="patient" name="Patient" radius={[6, 6, 0, 0]} barSize={24}>
                  {comparisonData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.patient > entry.normal * 1.15 ? '#ef4444' : '#38bdf8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
