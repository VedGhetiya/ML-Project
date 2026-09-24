import React from 'react';
import { User, Activity, FlaskConical, Flame, Send, Loader2 } from 'lucide-react';

export default function CardioForm({ formData, onChange, onSubmit, loading }) {
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value) || 0 : parseInt(value, 10);
    onChange(name, val);
  };

  const handleToggle = (name, val) => {
    onChange(name, val);
  };

  return (
    <div className="glass-card form-card">
      <div className="form-header">
        <h2>
          <Activity color="#ec4899" size={24} />
          Patient Clinical Parameters
        </h2>
      </div>

      <form onSubmit={onSubmit}>
        {/* 1. Demographics */}
        <div className="section-group">
          <div className="section-title">
            <User size={16} /> Demographics & Biometrics
          </div>
          <div className="form-grid-2">
            <div className="input-field">
              <label>
                Age <span className="unit-tag">(Years)</span>
              </label>
              <input
                type="number"
                name="age"
                min="1"
                max="120"
                value={formData.age}
                onChange={handleChange}
                className="custom-input"
                required
              />
            </div>

            <div className="input-field">
              <label>Gender</label>
              <div className="segmented-control">
                <button
                  type="button"
                  className={`segmented-btn ${formData.gender === 1 ? 'active' : ''}`}
                  onClick={() => handleToggle('gender', 1)}
                >
                  Female
                </button>
                <button
                  type="button"
                  className={`segmented-btn ${formData.gender === 2 ? 'active' : ''}`}
                  onClick={() => handleToggle('gender', 2)}
                >
                  Male
                </button>
              </div>
            </div>

            <div className="input-field">
              <label>
                Height <span className="unit-tag">(cm)</span>
              </label>
              <input
                type="number"
                name="height"
                min="50"
                max="250"
                value={formData.height}
                onChange={handleChange}
                className="custom-input"
                required
              />
            </div>

            <div className="input-field">
              <label>
                Weight <span className="unit-tag">(kg)</span>
              </label>
              <input
                type="number"
                name="weight"
                min="20"
                max="300"
                value={formData.weight}
                onChange={handleChange}
                className="custom-input"
                required
              />
            </div>
          </div>
        </div>

        {/* 2. Vitals */}
        <div className="section-group">
          <div className="section-title">
            <Activity size={16} /> Cardiovascular Hemodynamics
          </div>
          <div className="form-grid-2">
            <div className="input-field">
              <label>
                Systolic BP (ap_hi) <span className="unit-tag">(mmHg)</span>
              </label>
              <input
                type="number"
                name="ap_hi"
                min="50"
                max="250"
                value={formData.ap_hi}
                onChange={handleChange}
                className="custom-input"
                required
              />
            </div>

            <div className="input-field">
              <label>
                Diastolic BP (ap_lo) <span className="unit-tag">(mmHg)</span>
              </label>
              <input
                type="number"
                name="ap_lo"
                min="30"
                max="200"
                value={formData.ap_lo}
                onChange={handleChange}
                className="custom-input"
                required
              />
            </div>
          </div>
        </div>

        {/* 3. Clinical Labs */}
        <div className="section-group">
          <div className="section-title">
            <FlaskConical size={16} /> Laboratory Biochemical Panels
          </div>
          <div className="form-grid-2">
            <div className="input-field">
              <label>Serum Cholesterol</label>
              <select
                name="cholesterol"
                value={formData.cholesterol}
                onChange={handleChange}
                className="custom-select"
              >
                <option value={1}>1 — Normal (&lt; 200 mg/dL)</option>
                <option value={2}>2 — Above Normal (200-239 mg/dL)</option>
                <option value={3}>3 — Well Above Normal (≥ 240 mg/dL)</option>
              </select>
            </div>

            <div className="input-field">
              <label>Fasting Blood Glucose</label>
              <select
                name="gluc"
                value={formData.gluc}
                onChange={handleChange}
                className="custom-select"
              >
                <option value={1}>1 — Normal (&lt; 100 mg/dL)</option>
                <option value={2}>2 — Above Normal (100-125 mg/dL)</option>
                <option value={3}>3 — Well Above Normal (≥ 126 mg/dL)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. Lifestyle */}
        <div className="section-group">
          <div className="section-title">
            <Flame size={16} /> Behavioral & Lifestyle Factors
          </div>
          <div className="form-grid-2">
            <div className="input-field">
              <label>Tobacco Smoking</label>
              <div className="segmented-control">
                <button
                  type="button"
                  className={`segmented-btn ${formData.smoke === 0 ? 'active' : ''}`}
                  onClick={() => handleToggle('smoke', 0)}
                >
                  No
                </button>
                <button
                  type="button"
                  className={`segmented-btn ${formData.smoke === 1 ? 'active' : ''}`}
                  onClick={() => handleToggle('smoke', 1)}
                >
                  Yes
                </button>
              </div>
            </div>

            <div className="input-field">
              <label>Alcohol Consumption</label>
              <div className="segmented-control">
                <button
                  type="button"
                  className={`segmented-btn ${formData.alco === 0 ? 'active' : ''}`}
                  onClick={() => handleToggle('alco', 0)}
                >
                  No
                </button>
                <button
                  type="button"
                  className={`segmented-btn ${formData.alco === 1 ? 'active' : ''}`}
                  onClick={() => handleToggle('alco', 1)}
                >
                  Yes
                </button>
              </div>
            </div>

            <div className="input-field" style={{ gridColumn: '1 / -1' }}>
              <label>Physical Activity</label>
              <div className="segmented-control">
                <button
                  type="button"
                  className={`segmented-btn ${formData.active === 1 ? 'active' : ''}`}
                  onClick={() => handleToggle('active', 1)}
                >
                  Active Regular Exercise
                </button>
                <button
                  type="button"
                  className={`segmented-btn ${formData.active === 0 ? 'active' : ''}`}
                  onClick={() => handleToggle('active', 0)}
                >
                  Sedentary / Inactive Lifestyle
                </button>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="spinner" size={20} /> Running CardioVision Inference...
            </>
          ) : (
            <>
              <Send size={20} /> Evaluate Cardiovascular Risk
            </>
          )}
        </button>
      </form>
    </div>
  );
}
