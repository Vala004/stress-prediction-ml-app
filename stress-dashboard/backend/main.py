from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

# -----------------------
# CORS
# -----------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# Load model ONLY
# -----------------------
model = joblib.load("best_model_LightGBM.pkl")

# -----------------------
# Stress mapping (5 levels)
# -----------------------
stress_map = {
    0: "Very Low Stress",
    1: "Low Stress",
    2: "Moderate Stress",
    3: "High Stress",
    4: "Very High Stress",
}

# -----------------------
# Request schema
# -----------------------
class PredictionRequest(BaseModel):
    features: list[float]

# -----------------------
# Routes
# -----------------------
@app.get("/")
def root():
    return {"status": "Backend running"}

@app.get("/test-predict")
def test_predict():
    return {
        "stress_code": 1,
        "stress_label": stress_map[1]
    }

@app.post("/predict")
def predict(req: PredictionRequest):
    if len(req.features) != 9:
        return {"error": f"Expected 9 features, got {len(req.features)}"}

    X = np.array(req.features).reshape(1, -1)
    pred = int(model.predict(X)[0])

    return {
        "stress_code": pred,
        "stress_label": stress_map.get(pred, "Unknown")
    }
