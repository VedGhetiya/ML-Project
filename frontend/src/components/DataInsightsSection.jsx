import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';

/* ── Static dataset insight data (based on the Kaggle cardiovascular dataset) ── */

const featureImportanceData = [
  { name: 'Systolic BP', value: 0.168, fill: '#ef4444' },
  { name: 'Age', value: 0.152, fill: '#f97316' },
  { name: 'Weight', value: 0.138, fill: '#f59e0b' },
  { name: 'Diastolic BP', value: 0.127, fill: '#eab308' },
  { name: 'Cholesterol', value: 0.112, fill: '#10b981' },
  { name: 'Height', value: 0.088, fill: '#06b6d4' },
  { name: 'Glucose', value: 0.076, fill: '#3b82f6' },
  { name: 'Gender', value: 0.048, fill: '#6366f1' },
  { name: 'Active', value: 0.038, fill: '#8b5cf6' },
  { name: 'Smoke', value: 0.029, fill: '#ec4899' },
  { name: 'Alcohol', value: 0.024, fill: '#f43f5e' },
];

const ageDistributionData = [
  { age: '30-35', noDisease: 4200, disease: 800 },
  { age: '36-40', noDisease: 5100, disease: 1600 },
  { age: '41-45', noDisease: 5800, disease: 2900 },
  { age: '46-50', noDisease: 5400, disease: 4100 },
  { age: '51-55', noDisease: 4600, disease: 5200 },
  { age: '56-60', noDisease: 3200, disease: 5800 },
  { age: '61-65', noDisease: 1800, disease: 4200 },
];

const cholesterolData = [
  { name: 'Normal', value: 52000, fill: '#10b981' },
  { name: 'Above Normal', value: 9200, fill: '#f59e0b' },
  { name: 'Well Above Normal', value: 8800, fill: '#ef4444' },
];

const bpCategoryData = [
  { category: 'Normal', count: 28500, fill: '#10b981' },
  { category: 'Elevated', count: 8200, fill: '#06b6d4' },
  { category: 'Stage 1 HTN', count: 14300, fill: '#f59e0b' },
  { category: 'Stage 2 HTN', count: 12800, fill: '#f97316' },
  { category: 'Crisis', count: 6200, fill: '#ef4444' },
];

const genderRiskData = [
  { name: 'Female', lowRisk: 18200, highRisk: 16800 },
  { name: 'Male', lowRisk: 16300, highRisk: 18700 },
];

const lifestyleData = [
  { factor: 'Smoking', riskIncrease: 12 },
  { factor: 'Alcohol', riskIncrease: 8 },
  { factor: 'Inactivity', riskIncrease: 18 },
  { factor: 'High Cholesterol', riskIncrease: 35 },
  { factor: 'Hypertension', riskIncrease: 42 },
  { factor: 'High Glucose', riskIncrease: 28 },
];

const modelPerformanceData = [
  { metric: 'Accuracy', value: 73.4 },
  { metric: 'Precision', value: 74.2 },
  { metric: 'Recall', value: 71.8 },
  { metric: 'F1 Score', value: 72.9 },
  { metric: 'AUC-ROC', value: 78.5 },
];

const correlationData = [
  { feature: 'Systolic BP', correlation: 0.42 },
  { feature: 'Diastolic BP', correlation: 0.36 },
  { feature: 'Cholesterol', correlation: 0.22 },
  { feature: 'Age', correlation: 0.24 },
  { feature: 'Glucose', correlation: 0.09 },
  { feature: 'Weight', correlation: 0.18 },
  { feature: 'Smoking', correlation: 0.07 },
  { feature: 'Alcohol', correlation: 0.01 },
  { feature: 'Activity', correlation: -0.04 },
];

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ color: entry.color || entry.fill || '#6366f1' }}>
            {entry.name}: {typeof entry.value === 'number' && entry.value < 1
              ? `${(entry.value * 100).toFixed(1)}%`
              : entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* ── Chart Card wrapper ── */
function ChartCard({ title, icon, children, description }) {
  return (
    <div className="glass-card chart-card">
      <div className="chart-card-header">
        <div className="chart-card-title">
          {icon}
          <h3>{title}</h3>
        </div>
        {description && <p className="chart-card-desc">{description}</p>}
      </div>
      <div className="chart-card-body">
        {children}
      </div>
    </div>
  );
}

/* ── Pie Chart custom label ── */
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function DataInsightsSection() {
  return (
    <section className="data-insights-section" id="insights">
      <div className="insights-header">
        <BarChart3 size={32} color="#ec4899" />
        <div>
          <h2>Dataset Analytics & Model Intelligence</h2>
          <p>Key epidemiological patterns extracted from 70,000+ clinical patient records</p>
        </div>
      </div>

      <div className="charts-grid">
        {/* 1. Feature Importance */}
        <ChartCard
          title="Feature Importance (Random Forest)"
          icon={<TrendingUp size={20} color="#ec4899" />}
          description="Gini importance ranking of clinical biomarkers in the risk model"
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={featureImportanceData} layout="vertical" margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis type="number" stroke="#64748b" fontSize={11} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={90} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18}>
                {featureImportanceData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 2. Age vs Disease Distribution */}
        <ChartCard
          title="Age Demographics vs Disease Prevalence"
          icon={<Activity size={20} color="#6366f1" />}
          description="Prevalence surges dramatically across cohorts aged 45 and above"
        >
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={ageDistributionData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="colorNoDisease" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="colorDisease" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="age" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              <Area type="monotone" dataKey="noDisease" name="No Disease" stroke="#10b981" fill="url(#colorNoDisease)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="disease" name="Cardiovascular Disease" stroke="#ec4899" fill="url(#colorDisease)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 3. Cholesterol Distribution */}
        <ChartCard
          title="Serum Cholesterol Category Breakdown"
          icon={<Activity size={20} color="#f59e0b" />}
          description="Distribution of patient cohorts by clinical cholesterol thresholds"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={cholesterolData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={110}
                innerRadius={55}
                dataKey="value"
                strokeWidth={2}
                stroke="rgba(13,18,36,0.9)"
              >
                {cholesterolData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.fill} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 4. Blood Pressure Categories */}
        <ChartCard
          title="Blood Pressure Stage Stratification"
          icon={<Activity size={20} color="#ef4444" />}
          description="Patient volume mapped across AHA clinical blood pressure stages"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bpCategoryData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Patient Count" radius={[6, 6, 0, 0]} barSize={36}>
                {bpCategoryData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 5. Gender-wise Risk */}
        <ChartCard
          title="Gender Stratified Risk Distribution"
          icon={<Activity size={20} color="#06b6d4" />}
          description="Comparative risk distribution across biological male and female cohorts"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={genderRiskData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              <Bar dataKey="lowRisk" name="Low Risk" fill="#10b981" radius={[6, 6, 0, 0]} barSize={32} />
              <Bar dataKey="highRisk" name="High Risk" fill="#ec4899" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 6. Lifestyle Risk Increase */}
        <ChartCard
          title="Lifestyle Factors & Relative Risk Surge"
          icon={<TrendingUp size={20} color="#8b5cf6" />}
          description="Percentage increase in CVD likelihood attributed to specific risk factors"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={lifestyleData} layout="vertical" margin={{ left: 30, right: 20, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis type="number" stroke="#64748b" fontSize={11} tickFormatter={(v) => `+${v}%`} />
              <YAxis type="category" dataKey="factor" stroke="#94a3b8" fontSize={11} width={110} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="riskIncrease" name="Risk Increase %" radius={[0, 6, 6, 0]} barSize={18}>
                {lifestyleData.map((entry, idx) => {
                  const colors = ['#f97316', '#eab308', '#ec4899', '#8b5cf6', '#6366f1', '#f59e0b'];
                  return <Cell key={idx} fill={colors[idx % colors.length]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 7. Model Performance Radar */}
        <ChartCard
          title="Classifier Validation Metrics"
          icon={<Activity size={20} color="#10b981" />}
          description="Holistic evaluation of Random Forest model across 5 validation metrics"
        >
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={modelPerformanceData} cx="50%" cy="50%" outerRadius="75%">
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={11} />
              <PolarRadiusAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
              <Radar name="Score %" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2.5} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 8. Feature Correlation with Target */}
        <ChartCard
          title="Pearson Correlation with Cardiovascular Disease"
          icon={<TrendingUp size={20} color="#ec4899" />}
          description="Direct linear association of individual features with positive diagnosis"
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={correlationData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="feature" stroke="#94a3b8" fontSize={10} angle={-25} textAnchor="end" height={60} />
              <YAxis stroke="#64748b" fontSize={11} domain={[-0.1, 0.5]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="correlation" name="Correlation Coeff" radius={[6, 6, 0, 0]} barSize={28}>
                {correlationData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.correlation >= 0 ? (entry.correlation > 0.2 ? '#ec4899' : '#f59e0b') : '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>
  );
}
