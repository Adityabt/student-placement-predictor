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
    st.header("About This Project")
    
    st.write("""
    **Student Placement Predictor** is a machine learning web app that predicts 
    whether a student is likely to get placed based on their academic performance, 
    skills, and background. It also provides a personalized profile analysis 
    showing exactly where you stand and what to improve.
    """)
    
    st.divider()
    
    st.subheader("✨ Features")
    st.write("""
    - Placement prediction with confidence percentage
    - Personalized profile analysis dashboard
    - Comparison against average placed student
    - Actionable improvement tips per feature
    - Trained on 10,000 student records
    """)
    
    st.divider()
    
    st.subheader("🛠️ Tech Stack")
    st.write("Python · scikit-learn · XGBoost · Streamlit · pandas · plotly · joblib")
    
    st.divider()
    
    st.subheader("👨‍💻 Contributors")
    st.markdown("""
    | Name | Role | GitHub |
    |------|------|--------|
    | Aditya | ML Model + Profile Analysis | [@Adityabt](https://github.com/Adityabt) |
    | Jiya | Data Cleaning + Prediction UI | [@jiyagithub](https://github.com/jiyagithub) |
    """)
    
    st.divider()
    
    st.subheader("🔗 Links")
    st.markdown("""
    - [GitHub Repository](https://github.com/Adityabt/student-placement-predictor)
    - Live Demo — coming soon after deployment
    """)