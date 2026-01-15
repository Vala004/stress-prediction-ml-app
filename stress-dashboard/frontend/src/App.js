import React, { useState } from "react";
import "./App.css";

const BACKEND_URL = "https://stress-prediction-ml-app.onrender.com";

// Gauge mapping
const stressToAngle = (level) => {
  const map = {
    0: -90,
    1: -45,
    2: 0,
    3: 45,
    4: 90,
  };
  return map[level] ?? -90;
};

const stressLabels = {
  0: "Very Low Stress",
  1: "Low Stress",
  2: "Moderate Stress",
  3: "High Stress",
  4: "Very High Stress",
};

function App() {
  const [features, setFeatures] = useState(Array(9).fill(0));
  const [stressCode, setStressCode] = useState(2);
  const [connected, setConnected] = useState(null); // null = unknown

  const handleChange = (index, value) => {
    const updated = [...features];
    updated[index] = Number(value);
    setFeatures(updated);
  };

  const predictStress = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features }),
      });

      if (!res.ok) throw new Error("Backend error");

      const data = await res.json();
      setStressCode(data.stress_code);
      setConnected(true); // ✅ backend confirmed working
    } catch (err) {
      console.error(err);
      setConnected(false); // ❌ backend failed
    }
  };

  return (
    <div className="app">
      <h1>Stress Level Analysis</h1>

      {/* Backend status */}
      <div className="backend-status">
        <div
          className={`backend-dot ${
            connected === true
              ? "online"
              : connected === false
              ? "offline"
              : "unknown"
          }`}
        />
        <span>
          {connected === null
            ? "Backend status unknown"
            : connected
            ? "Backend Connected"
            : "Backend Not Reachable"}
        </span>
      </div>

      <div className="layout">
        {/* LEFT PANEL */}
        <div className="card">
          <h2>Input Features</h2>

          <div className="grid">
            {features.map((val, i) => (
              <input
                key={i}
                type="number"
                value={val}
                onChange={(e) => handleChange(i, e.target.value)}
              />
            ))}
          </div>

          <button className="predict-btn" onClick={predictStress}>
            Predict Stress Level
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div className="card center">
          <h2>Stress Meter</h2>

          <div className="gauge-container">
            <div className="gauge-bg" />
            <div
              className="gauge-needle"
              style={{
                transform: `rotate(${stressToAngle(stressCode)}deg)`,
              }}
            />
          </div>

          <h3 className="stress-label">{stressLabels[stressCode]}</h3>
          <p className="sub">Predicted Stress Level</p>
        </div>
      </div>
    </div>
  );
}

export default App;
