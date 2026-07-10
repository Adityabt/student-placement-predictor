import streamlit as st
import plotly.graph_objects as go
import pandas as pd
import joblib
from feature_engineering import engineer_features

FEATURE_COLS = [
    'Gender', 'Branch', 'Backlogs', 'SoftSkillsRating',
    'ExtracurricularActivities', 'PlacementTraining',
    'academic_score', 'employability_score', 'practical_exposure'
]

PLACED_AVG = {
    'CGPA': 8.02,
    'Backlogs': 0.14,
    'SSC Marks': 74.92,
    'HSC Marks': 79.81,
    'Internships': 1.25,
    'Projects': 2.51,
    'Workshops/Certs': 1.40,
    'Technical Score': 56.90,
    'Coding Score': 47.33,
    'GitHub Score': 5.90,
    'Aptitude Score': 84.46,
    'Soft Skills': 4.53,
}

HIGHER_IS_BETTER = {
    'CGPA': True, 'Backlogs': False, 'SSC Marks': True,
    'HSC Marks': True, 'Internships': True, 'Projects': True,
    'Workshops/Certs': True, 'Technical Score': True,
    'Coding Score': True, 'GitHub Score': True,
    'Aptitude Score': True, 'Soft Skills': True,
}

IMPROVEMENT_TIPS = {
    'CGPA': "Focus on consistent performance across all semesters.",
    'Backlogs': "Clear your pending backlogs ASAP — companies filter hard on this.",
    'SSC Marks': "Historical — nothing to change, keep it for reference.",
    'HSC Marks': "Historical — nothing to change, keep it for reference.",
    'Internships': "Apply on Internshala, LinkedIn, or via college placements.",
    'Projects': "Build 1-2 strong deployed projects — quality over quantity.",
    'Workshops/Certs': "Take free certifications on Coursera, Google, or AWS.",
    'Technical Score': "Practice DSA on LeetCode and strengthen CS fundamentals.",
    'Coding Score': "Stay consistent on Codeforces, CodeChef, or LeetCode.",
    'GitHub Score': "Push code regularly, keep your GitHub active and green.",
    'Aptitude Score': "Practice quant and logical reasoning on IndiaBix daily.",
    'Soft Skills': "Join debate clubs, mock GDs, or communication workshops.",
}

@st.cache_resource
def load_explainer():
    return joblib.load('shap_explainer.pkl')

def render(user_inputs, confidence, prediction):
    st.header("📊 Your Profile Analysis")

    if user_inputs is None:
        st.info("Enter your details in the Predict tab and click Predict to see your analysis.")
        return

    user_vals = {
        'CGPA': user_inputs['cgpa'],
        'Backlogs': user_inputs['backlogs'],
        'SSC Marks': user_inputs['ssc_marks'],
        'HSC Marks': user_inputs['hsc_marks'],
        'Internships': user_inputs['internships'],
        'Projects': user_inputs['projects'],
        'Workshops/Certs': user_inputs['workshops'],
        'Technical Score': user_inputs['technical_score'],
        'Coding Score': user_inputs['coding_score'],
        'GitHub Score': user_inputs['github_score'],
        'Aptitude Score': user_inputs['aptitude_score'],
        'Soft Skills': user_inputs['soft_skills'],
    }

    # ── 1. Gauge ──────────────────────────────────────────
    st.subheader("🎯 Placement Probability")
    color = "#4CAF50" if prediction == 1 else "#F44336"
    label = "Likely Placed" if prediction == 1 else "May Not Be Placed"

    fig_gauge = go.Figure(go.Indicator(
        mode="gauge+number",
        value=round(confidence, 1),
        number={'suffix': "%", 'font': {'size': 48}},
        title={'text': label, 'font': {'size': 20}},
        gauge={
            'axis': {'range': [0, 100]},
            'bar': {'color': color},
            'steps': [
                {'range': [0, 40], 'color': '#ffebee'},
                {'range': [40, 70], 'color': '#fff9c4'},
                {'range': [70, 100], 'color': '#e8f5e9'},
            ],
        }
    ))
    fig_gauge.update_layout(height=300, margin=dict(t=40, b=0))
    st.plotly_chart(fig_gauge, use_container_width=True)

    st.divider()

    # ── 2. SHAP — What's driving the prediction ───────────
    st.subheader("🧠 What's Driving Your Prediction")
    st.caption("Green bars push your result toward Placed. Red bars push it toward Not Placed.")

    try:
        explainer = load_explainer()

        raw_df = pd.DataFrame([{
            'Gender': 1,
            'Branch': 0,
            'Backlogs': user_inputs['backlogs'],
            'SSC_Marks': user_inputs['ssc_marks'],
            'HSC_Marks': user_inputs['hsc_marks'],
            'CGPA': user_inputs['cgpa'],
            'Internships': user_inputs['internships'],
            'Projects': user_inputs['projects'],
            'Workshops/Certifications': user_inputs['workshops'],
            'TechnicalSkillScore': user_inputs['technical_score'],
            'CodingPlatformScore': user_inputs['coding_score'],
            'GitHubScore': user_inputs['github_score'],
            'AptitudeTestScore': user_inputs['aptitude_score'],
            'SoftSkillsRating': user_inputs['soft_skills'],
            'ExtracurricularActivities': 1,
            'PlacementTraining': 1,
        }])

        engineered_df = engineer_features(raw_df)
        input_arr = engineered_df[FEATURE_COLS]
        shap_values = explainer.shap_values(input_arr)
        sv = shap_values[0] if isinstance(shap_values, list) else shap_values[0]

        shap_df = pd.DataFrame({
            'Feature': FEATURE_COLS,
            'SHAP Value': sv
        }).sort_values('SHAP Value', key=abs, ascending=True)

        colors = ['#F44336' if v < 0 else '#4CAF50' for v in shap_df['SHAP Value']]

        fig_shap = go.Figure(go.Bar(
            x=shap_df['SHAP Value'],
            y=shap_df['Feature'],
            orientation='h',
            marker_color=colors
        ))
        fig_shap.update_layout(
            height=380,
            margin=dict(t=20, b=20),
            xaxis_title="Impact on prediction (green = helps placement, red = hurts)"
        )
        st.plotly_chart(fig_shap, use_container_width=True)

    except Exception as e:
        st.warning(f"SHAP analysis unavailable: {e}")

    st.divider()

    # ── 3. Strong vs Weak ─────────────────────────────────
    strong, weak = [], []
    for feature, user_val in user_vals.items():
        avg = PLACED_AVG[feature]
        if HIGHER_IS_BETTER[feature]:
            (strong if user_val >= avg else weak).append(feature)
        else:
            (strong if user_val <= avg else weak).append(feature)

    col1, col2 = st.columns(2)
    with col1:
        st.subheader("✅ Strong Areas")
        if strong:
            for f in strong:
                st.success(f"**{f}**")
        else:
            st.warning("No areas above average yet.")
    with col2:
        st.subheader("⚠️ Needs Improvement")
        if weak:
            for f in weak:
                st.error(f"**{f}**")
                st.caption(IMPROVEMENT_TIPS[f])
        else:
            st.success("All areas above average — excellent!")

    st.divider()

    # ── 4. You vs Placed Students ─────────────────────────
    st.subheader("📈 You vs Average Placed Student")
    features = list(user_vals.keys())
    fig_bar = go.Figure()
    fig_bar.add_trace(go.Bar(
        name='You', x=features,
        y=list(user_vals.values()), marker_color='#2196F3'
    ))
    fig_bar.add_trace(go.Bar(
        name='Avg Placed Student', x=features,
        y=[PLACED_AVG[f] for f in features], marker_color='#4CAF50'
    ))
    fig_bar.update_layout(
        barmode='group', xaxis_tickangle=-35, height=420,
        margin=dict(t=20, b=80),
        legend=dict(orientation='h', yanchor='bottom', y=1.02, xanchor='right', x=1)
    )
    st.plotly_chart(fig_bar, use_container_width=True)

    st.divider()

    # ── 5. Detailed Breakdown ─────────────────────────────
    st.subheader("📋 Detailed Score Breakdown")
    for feature, user_val in user_vals.items():
        avg = PLACED_AVG[feature]
        is_good = (user_val >= avg) if HIGHER_IS_BETTER[feature] else (user_val <= avg)
        max_val = max(user_val, avg) * 1.2 if max(user_val, avg) > 0 else 1
        progress = min(user_val / max_val, 1.0)
        icon = "✅" if is_good else "⚠️"

        col_a, col_b = st.columns([3, 1])
        with col_a:
            st.write(f"{icon} **{feature}** — You: `{user_val}` | Placed Avg: `{avg}`")
            st.progress(progress)
        with col_b:
            delta = round(user_val - avg, 2)
            st.metric(label="", value=user_val,
                      delta=f"+{delta}" if delta > 0 else str(delta))