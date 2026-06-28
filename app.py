import streamlit as st
import joblib
import pandas as pd
from prediction_tab import render as prediction_render
from analysis_tab import render as analysis_render

# ── Load model once ────────────────────────────────────────
model = joblib.load('model.pkl')

# ── Page config ────────────────────────────────────────────
st.set_page_config(
    page_title="Student Placement Predictor",
    page_icon="🎓",
    layout="wide"
)

st.title("🎓 Student Placement Predictor")

# ── Session state defaults ─────────────────────────────────
if 'prediction' not in st.session_state:
    st.session_state['prediction'] = None
if 'confidence' not in st.session_state:
    st.session_state['confidence'] = None
if 'user_inputs' not in st.session_state:
    st.session_state['user_inputs'] = None

# ── Tabs ───────────────────────────────────────────────────
tab1, tab2, tab3 = st.tabs(["🔮 Predict", "📊 Profile Analysis", "ℹ️ About"])

with tab1:
    prediction_render(model)

with tab2:
    analysis_render(
        user_inputs=st.session_state['user_inputs'],
        confidence=st.session_state['confidence'],
        prediction=st.session_state['prediction']
    )

with tab3:
    st.info("About — coming soon")