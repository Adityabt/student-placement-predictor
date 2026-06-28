import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd

# ── Real averages from dataset ─────────────────────────────
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

# Higher is better for all except Backlogs
HIGHER_IS_BETTER = {
    'CGPA': True,
    'Backlogs': False,
    'SSC Marks': True,
    'HSC Marks': True,
    'Internships': True,
    'Projects': True,
    'Workshops/Certs': True,
    'Technical Score': True,
    'Coding Score': True,
    'GitHub Score': True,
    'Aptitude Score': True,
    'Soft Skills': True,
}

IMPROVEMENT_TIPS = {
    'CGPA': "Focus on consistent performance across all semesters.",
    'Backlogs': "Clear your pending backlogs as soon as possible — companies filter on this.",
    'SSC Marks': "Historical — keep it for reference.",
    'HSC Marks': "Historical — keep it for reference.",
    'Internships': "Apply for internships on Internshala, LinkedIn, or via college placements.",
    'Projects': "Build 1-2 strong projects and deploy them — quality over quantity.",
    'Workshops/Certs': "Take free certifications on Coursera, Google, or AWS to boost this.",
    'Technical Score': "Practice DSA on LeetCode and strengthen your core CS fundamentals.",
    'Coding Score': "Be consistent on Codeforces, CodeChef, or LeetCode — ratings matter.",
    'GitHub Score': "Push code regularly, contribute to open source, keep your GitHub active.",
    'Aptitude Score': "Practice quant and logical reasoning on IndiaBix or PrepInsta daily.",
    'Soft Skills': "Join debate clubs, mock GDs, or communication workshops at your college.",
}


def render(user_inputs, confidence, prediction):
    st.header("📊 Your Profile Analysis")

    if user_inputs is None:
        st.info("Enter your details in the Predict tab and click Predict to see your analysis.")
        return

    # ── Unpack user inputs ─────────────────────────────────
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

    # ── 1. Placement Probability Gauge ────────────────────
    st.subheader("🎯 Placement Probability")
    color = "#4CAF50" if prediction == 1 else "#F44336"
    label = "Likely Placed" if prediction == 1 else "May Not Be Placed"

    fig_gauge = go.Figure(go.Indicator(
        mode="gauge+number+delta",
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
            'threshold': {
                'line': {'color': color, 'width': 4},
                'thickness': 0.75,
                'value': confidence
            }
        }
    ))
    fig_gauge.update_layout(height=300, margin=dict(t=40, b=0))
    st.plotly_chart(fig_gauge, use_container_width=True)

    st.divider()

    # ── 2. Strong vs Weak Areas ───────────────────────────
    strong = []
    weak = []

    for feature, user_val in user_vals.items():
        avg = PLACED_AVG[feature]
        higher_is_better = HIGHER_IS_BETTER[feature]
        if higher_is_better:
            if user_val >= avg:
                strong.append(feature)
            else:
                weak.append(feature)
        else:
            if user_val <= avg:
                strong.append(feature)
            else:
                weak.append(feature)

    col1, col2 = st.columns(2)

    with col1:
        st.subheader("✅ Your Strong Areas")
        if strong:
            for f in strong:
                st.success(f"**{f}** — above placed student average")
        else:
            st.warning("No areas above average yet — keep working!")

    with col2:
        st.subheader("⚠️ Areas to Improve")
        if weak:
            for f in weak:
                st.error(f"**{f}**")
                st.caption(IMPROVEMENT_TIPS[f])
        else:
            st.success("All areas are above average — great profile!")

    st.divider()

    # ── 3. You vs Placed Students Bar Chart ───────────────
    st.subheader("📈 You vs Average Placed Student")

    features = list(user_vals.keys())
    your_values = list(user_vals.values())
    placed_values = [PLACED_AVG[f] for f in features]

    fig_bar = go.Figure()
    fig_bar.add_trace(go.Bar(
        name='You',
        x=features,
        y=your_values,
        marker_color='#2196F3'
    ))
    fig_bar.add_trace(go.Bar(
        name='Avg Placed Student',
        x=features,
        y=placed_values,
        marker_color='#4CAF50'
    ))
    fig_bar.update_layout(
        barmode='group',
        xaxis_tickangle=-35,
        height=420,
        margin=dict(t=20, b=80),
        legend=dict(orientation='h', yanchor='bottom', y=1.02, xanchor='right', x=1)
    )
    st.plotly_chart(fig_bar, use_container_width=True)

    st.divider()

    # ── 4. Per-Feature Progress Bars ──────────────────────
    st.subheader("📋 Detailed Score Breakdown")

    for feature, user_val in user_vals.items():
        avg = PLACED_AVG[feature]
        higher_is_better = HIGHER_IS_BETTER[feature]

        if higher_is_better:
            is_good = user_val >= avg
            max_val = max(user_val, avg) * 1.2
            progress = min(user_val / max_val, 1.0)
        else:
            is_good = user_val <= avg
            max_val = max(user_val, avg) * 1.2
            progress = min(user_val / max_val, 1.0)

        icon = "✅" if is_good else "⚠️"
        col_a, col_b = st.columns([3, 1])
        with col_a:
            st.write(f"{icon} **{feature}** — You: `{user_val}` | Placed Avg: `{avg}`")
            st.progress(progress)
        with col_b:
            delta = round(user_val - avg, 2)
            delta_str = f"+{delta}" if delta > 0 else str(delta)
            st.metric(label="", value=user_val, delta=delta_str)