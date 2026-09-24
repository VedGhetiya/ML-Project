import React from 'react';
import { Zap, Sparkles, HeartHandshake, AlertCircle, ShieldCheck } from 'lucide-react';

const PRESETS = [
  {
    id: 'healthy',
    title: 'Optimal Health Profile',
    desc: 'Age 32 · BP 115/75 · Normal Labs · Physically Active',
    icon: ShieldCheck,
    values: {
      age: 32,
      gender: 2,
      height: 175,
      weight: 70,
      ap_hi: 115,
      ap_lo: 75,
      cholesterol: 1,
      gluc: 1,
      smoke: 0,
      alco: 0,
      active: 1,
    },
  },
  {
    id: 'moderate',
    title: 'Pre-Hypertensive Profile',
    desc: 'Age 52 · BP 138/88 · Above Normal Chol · Overweight',
    icon: HeartHandshake,
    values: {
      age: 52,
      gender: 1,
      height: 162,
      weight: 76,
      ap_hi: 138,
      ap_lo: 88,
      cholesterol: 2,
      gluc: 1,
      smoke: 0,
      alco: 0,
      active: 1,
    },
  },
  {
    id: 'high',
    title: 'High Risk Clinical Profile',
    desc: 'Age 64 · BP 165/98 · High Chol & Gluc · Smoker',
    icon: AlertCircle,
    values: {
      age: 64,
      gender: 2,
      height: 170,
      weight: 88,
      ap_hi: 165,
      ap_lo: 98,
      cholesterol: 3,
      gluc: 2,
      smoke: 1,
      alco: 1,
      active: 0,
    },
  },
];

export default function PresetSelector({ onSelectPreset, handlePreset }) {
  const onSelect = onSelectPreset || handlePreset;
  return (
    <div className="presets-container">
      <div className="presets-header">
        <Sparkles size={16} />
        <span>Clinical Benchmark Presets</span>
      </div>
      <div className="presets-grid">
        {PRESETS.map((preset) => {
          const Icon = preset.icon;
          return (
            <button
              key={preset.id}
              className="preset-btn"
              onClick={() => onSelect && onSelect(preset.values)}
              type="button"
            >
              <div>
                <div className="preset-title">{preset.title}</div>
                <div className="preset-desc">{preset.desc}</div>
              </div>
              <div className="preset-icon">
                <Icon size={18} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
