from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import sys
import os

sys.path.append(os.path.dirname(__file__))
from feature_engineering import engineer_features

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Granular raw features feed the model now — composites are computed
# separately below, purely for the UI's display cards.
#
# HasPortfolio / WillingToRelocate / PreferredRoleCategory / ExpectedCTC
# were previously collected in the UI but sent as ignored payload extras.
# They now carry real signal — see hyperparameter_tune.py, which added
# them to the Optuna-tuned CatBoost retrain (held-out test accuracy 85%,
# best CV accuracy 83.53%). WillingToRelocate and PreferredRoleCategory
# are true categoricals for CatBoost, same as Gender/Branch.
FEATURE_COLS = [
    'Gender', 'Branch', 'Backlogs', 'SSC_Marks', 'HSC_Marks', 'CGPA',
    'Internships', 'Projects', 'Workshops/Certifications',
    'TechnicalSkillScore', 'CodingPlatformScore', 'GitHubScore',
    'AptitudeTestScore', 'SoftSkillsRating', 'ExtracurricularActivities',
    'PlacementTraining',
    'HasPortfolio', 'WillingToRelocate', 'PreferredRoleCategory', 'ExpectedCTC',
]

BASE_DIR = os.path.dirname(__file__)
model = joblib.load(os.path.join(BASE_DIR, 'model.pkl'))
explainer = joblib.load(os.path.join(BASE_DIR, 'shap_explainer.pkl'))

BRANCH_NAMES = [
    "CSE", "Civil", "ECE", "EEE", "IT", "Mechanical",
    "AI & Data Science", "Cybersecurity", "Biotechnology",
    "Chemical", "Aerospace", "Robotics & Automation",
]

# Must stay index-aligned with PREFERRED_ROLES in PredictForm.jsx (that
# list has no "Other" entry anymore — see PredictForm.jsx comment for why).
PREFERRED_ROLE_NAMES = [
    "Software Development Engineer",
    "Data Analyst",
    "Data Scientist / ML Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "QA / Test Engineer",
    "Core Engineering (Non-IT)",
    "Business Analyst",
]

RELOCATE_NAMES = ["No", "Yes", "Flexible"]  # index-aligned with training encoding

FEATURE_LABELS = {
    'Gender': 'Gender',
    'Branch': 'Branch',
    'Backlogs': 'Backlogs',
    'SSC_Marks': '10th Percentage',
    'HSC_Marks': '12th Percentage',
    'CGPA': 'CGPA',
    'Internships': 'Internships',
    'Projects': 'Projects',
    'Workshops/Certifications': 'Workshops & Certifications',
    'TechnicalSkillScore': 'Technical Skill Score',
    'CodingPlatformScore': 'Coding Platform Score',
    'GitHubScore': 'GitHub Activity',
    'AptitudeTestScore': 'Aptitude Test Score',
    'SoftSkillsRating': 'Soft Skills',
    'ExtracurricularActivities': 'Extracurricular Activities',
    'PlacementTraining': 'Placement Training',
    'HasPortfolio': 'Portfolio Presence',
    'WillingToRelocate': 'Willingness to Relocate',
    'PreferredRoleCategory': 'Preferred Role',
    'ExpectedCTC': 'Expected CTC',
}

# User-facing categories for the "What Matters Most" panel. Gender and
# Branch are deliberately excluded here — Branch already has its own
# dedicated panels, and Gender isn't something we editorialize as a
# "driver" of placement in the UI.
#
# PlacementTraining sits in Test & Prep Readiness, not Soft Skills —
# completing placement training is a preparation/readiness signal
# (same domain as aptitude prep), not a personality trait.
#
# Career Preferences is new — these four aren't "readiness" or "academic"
# signals, they're about fit/expectations, so they get their own group
# rather than being shoehorned into an existing one.
DISPLAY_GROUPS = {
    "Academic Performance": ['SSC_Marks', 'HSC_Marks', 'CGPA', 'Backlogs'],
    "Test & Prep Readiness": ['AptitudeTestScore', 'PlacementTraining', 'TechnicalSkillScore', 'CodingPlatformScore', 'GitHubScore'],
    "Extracurricular & Soft Skills": ['ExtracurricularActivities', 'SoftSkillsRating'],
    "Practical Experience": ['Internships', 'Projects', 'Workshops/Certifications'],
    "Career Preferences": ['HasPortfolio', 'WillingToRelocate', 'PreferredRoleCategory', 'ExpectedCTC'],
}

CGPA_BINS = [0, 6, 7, 8, 9, 10.01]
CGPA_LABELS = ["Below 6", "6 - 7", "7 - 8", "8 - 9", "9 - 10"]

dataset_df = pd.read_csv(os.path.join(BASE_DIR, 'placement_clean.csv'))
feature_importance = joblib.load(os.path.join(BASE_DIR, 'feature_importance.pkl'))


class StudentInput(BaseModel):
    gender: int
    branch: int
    backlogs: int
    ssc_marks: float
    hsc_marks: float
    cgpa: float
    internships: int
    projects: int
    workshops: int
    technical_score: float
    coding_score: float
    github_score: float
    aptitude_score: float
    soft_skills: float
    extracurricular: int
    placement_training: int
    # New — real model inputs, encoding must match hyperparameter_tune.py:
    # has_portfolio: 0/1
    # willing_to_relocate: 0=No, 1=Yes, 2=Flexible
    # preferred_role_category: 0-9, index into PREFERRED_ROLE_NAMES
    # expected_ctc: float, LPA
    has_portfolio: int
    willing_to_relocate: int
    preferred_role_category: int
    expected_ctc: float


def _normalize_to_100(values):
    """Turn a list of non-negative magnitudes into percentages that sum to
    exactly 100.0, rounded to 1 decimal (residual absorbed by the largest
    entry so the UI never shows a category total like 99.8% or 100.2%)."""
    total = sum(values)
    if total == 0:
        even = round(100.0 / len(values), 1) if values else 0.0
        return [even for _ in values]

    raw = [v / total * 100 for v in values]
    rounded = [round(x, 1) for x in raw]
    diff = round(100.0 - sum(rounded), 1)
    if rounded:
        max_idx = rounded.index(max(rounded))
        rounded[max_idx] = round(rounded[max_idx] + diff, 1)
    return rounded


@app.get("/")
def root():
    return {"status": "Student Placement Predictor API is running"}


@app.post("/predict")
def predict(data: StudentInput):
    raw_df = pd.DataFrame([{
        'Gender': data.gender,
        'Branch': data.branch,
        'Backlogs': data.backlogs,
        'SSC_Marks': data.ssc_marks,
        'HSC_Marks': data.hsc_marks,
        'CGPA': data.cgpa,
        'Internships': data.internships,
        'Projects': data.projects,
        'Workshops/Certifications': data.workshops,
        'TechnicalSkillScore': data.technical_score,
        'CodingPlatformScore': data.coding_score,
        'GitHubScore': data.github_score,
        'AptitudeTestScore': data.aptitude_score,
        'SoftSkillsRating': data.soft_skills,
        'ExtracurricularActivities': data.extracurricular,
        'PlacementTraining': data.placement_training,
        'HasPortfolio': data.has_portfolio,
        'WillingToRelocate': data.willing_to_relocate,
        'PreferredRoleCategory': data.preferred_role_category,
        'ExpectedCTC': data.expected_ctc,
    }])

    # Still computed for the UI's gauge/chart components — no longer
    # what the model actually predicts on.
    engineered_df = engineer_features(raw_df)
    input_data = engineered_df[FEATURE_COLS]

    prediction = int(model.predict(input_data)[0])
    confidence = float(model.predict_proba(input_data)[0][1] * 100)

    shap_values = explainer.shap_values(input_data)
    sv = shap_values[0] if isinstance(shap_values, list) else shap_values[0]

    shap_result = [
        {"feature": FEATURE_COLS[i], "value": float(sv[i])}
        for i in range(len(FEATURE_COLS))
    ]

    engineered = engineered_df.iloc[0]

    return {
        "prediction": prediction,
        "confidence": round(confidence, 2),
        "shap_values": shap_result,
        "engineered_scores": {
            "academic_score": round(float(engineered['academic_score']), 2),
            "employability_score": round(float(engineered['employability_score']), 2),
            "practical_exposure": round(float(engineered['practical_exposure']), 2),
        }
    }


@app.get("/analysis")
def analysis():
    df = dataset_df

    total_students = int(len(df))
    placement_rate = round(float(df['PlacementStatus'].mean()) * 100, 2)
    avg_cgpa = round(float(df['CGPA'].mean()), 2)

    importance_pairs = list(zip(FEATURE_COLS, feature_importance))
    importance_pairs.sort(key=lambda x: x[1], reverse=True)
    total_importance = sum(v for _, v in importance_pairs)
    global_importance = [
        {
            "feature": FEATURE_LABELS.get(name, name),
            "importance": round(float(value) / float(total_importance) * 100, 2),
        }
        for name, value in importance_pairs
    ]

    # Grouped, drill-down version for the "What Matters Most" panel.
    # Each category's top-level bar reflects its share of overall model
    # importance; expanding it shows each raw feature's share WITHIN that
    # category specifically — both computed straight from feature_importance.pkl.
    importance_by_feature = {name: float(value) for name, value in importance_pairs}

    grouped_importance = []
    for group_label, members in DISPLAY_GROUPS.items():
        raw_vals = [importance_by_feature[m] for m in members]
        group_share_of_total = round(sum(raw_vals) / total_importance * 100, 2)
        within_group_shares = _normalize_to_100(raw_vals)

        children = [
            {"feature": FEATURE_LABELS.get(m, m), "share_of_group": share}
            for m, share in zip(members, within_group_shares)
        ]
        children.sort(key=lambda x: x["share_of_group"], reverse=True)

        grouped_importance.append({
            "group": group_label,
            "importance": group_share_of_total,
            "features": children,
        })
    grouped_importance.sort(key=lambda x: x["importance"], reverse=True)

    branch_stats = []
    for idx, name in enumerate(BRANCH_NAMES):
        branch_df = df[df['Branch'] == idx]
        if len(branch_df) == 0:
            continue
        branch_stats.append({
            "branch": name,
            "placement_rate": round(float(branch_df['PlacementStatus'].mean()) * 100, 2),
            "count": int(len(branch_df)),
        })

    df_binned = df.copy()
    df_binned['cgpa_band'] = pd.cut(df_binned['CGPA'], bins=CGPA_BINS, labels=CGPA_LABELS, right=False)
    cgpa_bands = []
    for label in CGPA_LABELS:
        band_df = df_binned[df_binned['cgpa_band'] == label]
        if len(band_df) == 0:
            continue
        cgpa_bands.append({
            "range": label,
            "placement_rate": round(float(band_df['PlacementStatus'].mean()) * 100, 2),
            "count": int(len(band_df)),
        })

    return {
        "dataset_summary": {
            "total_students": total_students,
            "placement_rate": placement_rate,
            "avg_cgpa": avg_cgpa,
        },
        "global_importance": global_importance,
        "grouped_importance": grouped_importance,
        "branch_stats": branch_stats,
        "cgpa_bands": cgpa_bands,
    }