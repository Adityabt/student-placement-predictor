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

FEATURE_COLS = [
    'Gender', 'Branch', 'Backlogs', 'SoftSkillsRating',
    'ExtracurricularActivities', 'PlacementTraining',
    'academic_score', 'employability_score', 'practical_exposure'
]

BASE_DIR = os.path.dirname(__file__)
model = joblib.load(os.path.join(BASE_DIR, 'model.pkl'))
explainer = joblib.load(os.path.join(BASE_DIR, 'shap_explainer.pkl'))

BRANCH_NAMES = ["CSE", "Civil", "ECE", "EEE", "IT", "Mechanical"]

FEATURE_LABELS = {
    'Gender': 'Gender',
    'Branch': 'Branch',
    'Backlogs': 'Backlogs',
    'SoftSkillsRating': 'Soft Skills',
    'ExtracurricularActivities': 'Extracurricular Activities',
    'PlacementTraining': 'Placement Training',
    'academic_score': 'Academic Score',
    'employability_score': 'Employability Score',
    'practical_exposure': 'Practical Exposure',
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
    }])

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
        "branch_stats": branch_stats,
        "cgpa_bands": cgpa_bands,
    }