import React, { useState, useEffect } from "react";
import "./App.css";

const stressMap = {
  0: { angle: -90, label: "Very Low Stress", class: "very-low" },
  1: { angle: -45, label: "Low Stress", class: "low" },
  2: { angle: 0, label: "Moderate Stress", class: "medium" },
  3: { angle: 45, label: "High Stress", class: "high" },
  4: { angle: 90, label: "Very High Stress", class: "critical" }
};

function App() {
  const [features, setFeatures] = useState(Array(9).fill(0));
  const [stressAngle, setStressAngle] = useState(-90);
  const [stressLabel, setStressLabel] = useState("Awaiting Prediction");
  const [stressClass, setStressClass] = useState("");
  const [backendStatus, setBackendStatus] = useState("Checking backend...");

  // -----------------------
  // Check backend health
  // -----------------------
  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then(() => setBackendStatus("Backend Connected"))
      .catch(() => setBackendStatus("Backend Not Reachable"));
  }, []);

  // -----------------------
  // Handle input
  // -----------------------
  const updateFeature = (index, value) => {
    const updated = [...features];
    updated[index] = Number(value);
    setFeatures(updated);
  };

  // -----------------------
  // Predict
  // -----------------------
  const handlePredict = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features })
      });

      const data = await res.json();

      if (data.stress_code !== undefined) {
        const result = stressMap[data.stress_code];
        setStressAngle(result.angle);
        setStressLabel(result.label);
        setStressClass(result.class);
      }
    } catch {
      setStressLabel("Backend Not Reachable");
      setStressClass("critical");
    }
  };

  return (
    <div className="app">
      <h1>Stress Level Analysis</h1>

      <div className="container">
        {/* LEFT PANEL */}
        <div className="card">
          <h2>Input Features</h2>

          <div className="grid">
            {features.map((val, i) => (
              <input
                key={i}
                type="number"
                value={val}
                onChange={(e) => updateFeature(i, e.target.value)}
              />
            ))}
          </div>

          <button onClick={handlePredict}>Predict Stress Level</button>
        </div>

        {/* RIGHT PANEL */}
        <div className="card center">
          <h2>Stress Meter</h2>

          <div className="gauge">
            <div
              className="needle"
              style={{ transform: `rotate(${stressAngle}deg)` }}
            />
          </div>

          <div className={`result ${stressClass}`}>
            {stressLabel}
          </div>

          <div className="backend-status">{backendStatus}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
