import streamlit as st
import numpy as np
import joblib

# -------------------------------
# Load model and preprocessing
# -------------------------------
model = joblib.load("models/best_model_LightGBM.joblib")
scaler = joblib.load("models/scaler.joblib")
feature_names = joblib.load("models/feature_names.joblib")

# -------------------------------
# App UI
# -------------------------------
st.set_page_config(page_title="BT Management Predictor", layout="centered")

st.title("📊 BT Management Prediction App")
st.write("Enter the feature values below to get a prediction.")

# -------------------------------
# Input fields
# -------------------------------
input_data = []

for feature in feature_names:
    value = st.number_input(f"{feature}", value=0.0)
    input_data.append(value)

# -------------------------------
# Prediction
# -------------------------------
if st.button("Predict"):
    X = np.array(input_data).reshape(1, -1)
    X_scaled = scaler.transform(X)
    prediction = model.predict(X_scaled)

    st.success(f"✅ Prediction: {prediction[0]}")
