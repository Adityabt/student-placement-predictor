import optuna
import pandas as pd
import joblib
import shap
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from catboost import CatBoostClassifier

optuna.logging.set_verbosity(optuna.logging.WARNING)

df = pd.read_csv('placement_clean.csv')

FEATURE_COLS = [
    'Gender', 'Branch', 'Backlogs', 'SSC_Marks', 'HSC_Marks', 'CGPA',
    'Internships', 'Projects', 'Workshops/Certifications',
    'TechnicalSkillScore', 'CodingPlatformScore', 'GitHubScore',
    'AptitudeTestScore', 'SoftSkillsRating', 'ExtracurricularActivities',
    'PlacementTraining',
    # New — personal/profile fields that now carry real signal instead of
    # riding along as ignored payload extras. WillingToRelocate and
    # PreferredRoleCategory are categorical (added to CAT_FEATURES below);
    # HasPortfolio and ExpectedCTC are numeric like the rest.
    'HasPortfolio', 'WillingToRelocate', 'PreferredRoleCategory', 'ExpectedCTC',
]
CAT_FEATURES = ['Gender', 'Branch', 'WillingToRelocate', 'PreferredRoleCategory']

X = df[FEATURE_COLS]
y = df['PlacementStatus']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

def objective(trial):
    params = {
        'iterations': trial.suggest_int('iterations', 200, 600),
        'depth': trial.suggest_int('depth', 4, 8),
        'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.15),
        'l2_leaf_reg': trial.suggest_float('l2_leaf_reg', 1, 10, log=True),
        'random_strength': trial.suggest_float('random_strength', 0.0, 2.0),
    }
    # cat_features left OUT of the constructor here — that's the fix.
    model = CatBoostClassifier(
        **params, random_state=42, verbose=False, train_dir='catboost_info'
    )
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    # cat_features passed via fit params instead, using sklearn's newer `params=` arg
    return cross_val_score(
        model, X_train, y_train, cv=cv, scoring='accuracy',
        params={'cat_features': CAT_FEATURES}
    ).mean()

study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=50, show_progress_bar=True)

print("Best CV params:", study.best_params)
print("Best CV accuracy:", round(study.best_value * 100, 2))

# Final models DO use cat_features in the constructor — that's fine and correct,
# clone() is only invoked during cross_val_score, not during a plain .fit()
best_model = CatBoostClassifier(
    **study.best_params, cat_features=CAT_FEATURES,
    random_state=42, verbose=False, train_dir='catboost_info'
)
best_model.fit(X_train, y_train)
test_acc = best_model.score(X_test, y_test)
print(f"Held-out test accuracy: {round(test_acc * 100, 2)}%")

final_model = CatBoostClassifier(
    **study.best_params, cat_features=CAT_FEATURES,
    random_state=42, verbose=False, train_dir='catboost_info'
)
final_model.fit(X, y)

joblib.dump(final_model, 'model.pkl')
joblib.dump(final_model.get_feature_importance(), 'feature_importance.pkl')
print("model.pkl and feature_importance.pkl saved")

explainer = shap.TreeExplainer(final_model)
joblib.dump(explainer, 'shap_explainer.pkl')
print("shap_explainer.pkl saved")