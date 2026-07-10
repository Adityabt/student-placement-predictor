import pandas as pd
import joblib
from feature_engineering import engineer_features
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

# ── Load Data ──────────────────────────────────────────────
df = pd.read_csv('placement_clean.csv')
df = engineer_features(df)

# Drop CompanyTier — data leakage (only exists for placed students)
X = df.drop(['PlacementStatus', 'InterviewRoundsCleared', 'CompanyTier'], axis=1)
y = df['PlacementStatus']

print("Features used:", X.columns.tolist())
print("Dataset shape:", X.shape)

# ── Train Test Split ───────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ── Define Models ──────────────────────────────────────────
models = {
    'Logistic Regression': Pipeline([
        ('scaler', StandardScaler()),
        ('model', LogisticRegression(max_iter=1000))
    ]),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    'XGBoost': XGBClassifier(eval_metric='logloss', random_state=42)
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

# ── Pick Best Model & Save ─────────────────────────────────
best_model_name = results_df['Accuracy'].idxmax()
best_model = models[best_model_name]

print(f"\n✅ Best Model: {best_model_name} ({results_df.loc[best_model_name, 'Accuracy']}% accuracy)")

joblib.dump(best_model, 'model.pkl')
print("💾 model.pkl saved successfully")