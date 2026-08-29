import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
from catboost import CatBoostClassifier
import warnings
warnings.filterwarnings('ignore', category=RuntimeWarning, module='sklearn')

# ── Load Data ──────────────────────────────────────────────
df = pd.read_csv('placement_clean.csv')

# Granular raw features — composites are no longer fed to any model.
# Folding correlated raw columns into averaged composites was costing
# real signal (AptitudeTestScore alone: 0.52 corr, TechnicalSkillScore
# alone: 0.51 corr — both stronger than the blended employability_score).
FEATURE_COLS = [
    'Gender', 'Branch', 'Backlogs', 'SSC_Marks', 'HSC_Marks', 'CGPA',
    'Internships', 'Projects', 'Workshops/Certifications',
    'TechnicalSkillScore', 'CodingPlatformScore', 'GitHubScore',
    'AptitudeTestScore', 'SoftSkillsRating', 'ExtracurricularActivities',
    'PlacementTraining',
    # New — see hyperparameter_tune.py for the categorical handling
    # (WillingToRelocate / PreferredRoleCategory) these need for CatBoost;
    # this baseline script doesn't do categorical encoding for any model
    # here besides Branch/Gender already being left as raw ints, so these
    # new categorical ints ride along the same way.
    'HasPortfolio', 'WillingToRelocate', 'PreferredRoleCategory', 'ExpectedCTC',
]

X = df[FEATURE_COLS]
y = df['PlacementStatus']
# CompanyTier and InterviewRoundsCleared stay excluded — confirmed leakage.

print("Features used:", X.columns.tolist())
print("Dataset shape:", X.shape)

# ── Train Test Split ───────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ── Define Models ──────────────────────────────────────────
models = {
    'Logistic Regression': Pipeline([
    ('scaler', StandardScaler()),
    ('model', LogisticRegression(max_iter=1000, solver='lbfgs', C=1.0))
]),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    'XGBoost': XGBClassifier(eval_metric='logloss', random_state=42),
    'LightGBM': LGBMClassifier(n_estimators=300, max_depth=6, learning_rate=0.03, random_state=42, verbose=-1),
    'CatBoost': CatBoostClassifier(iterations=300, depth=6, learning_rate=0.03, random_state=42, verbose=False),
}

# ── Train & Evaluate ───────────────────────────────────────
results = {}

for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    results[name] = {
        'Accuracy':  round(accuracy_score(y_test, y_pred) * 100, 2),
        'Precision': round(precision_score(y_test, y_pred) * 100, 2),
        'Recall':    round(recall_score(y_test, y_pred) * 100, 2),
        'F1 Score':  round(f1_score(y_test, y_pred) * 100, 2)
    }

# ── Print Comparison Table ─────────────────────────────────
results_df = pd.DataFrame(results).T
print("\n📊 Model Comparison:\n")
print(results_df.to_string())

best_model_name = results_df['Accuracy'].idxmax()
best_model = models[best_model_name]

print(f"\n✅ Best Model: {best_model_name} ({results_df.loc[best_model_name, 'Accuracy']}% accuracy)")
print("Note: production model is trained separately in hyperparameter_tune.py")
print("with CatBoost + true categorical Branch/Gender/WillingToRelocate/")
print("PreferredRoleCategory + Optuna tuning.")

joblib.dump(best_model, 'baseline_model.pkl')
print("💾 baseline_model.pkl saved — comparison reference only, NOT used in the app")