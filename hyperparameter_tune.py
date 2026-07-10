import optuna
from xgboost import XGBClassifier
from sklearn.model_selection import cross_val_score
import pandas as pd
import joblib
from feature_engineering import engineer_features

df = pd.read_csv('placement_clean.csv')
df = engineer_features(df)

X = df.drop(['PlacementStatus', 'InterviewRoundsCleared', 'CompanyTier'], axis=1)
y = df['PlacementStatus']

def objective(trial):
    params = {
        'n_estimators': trial.suggest_int('n_estimators', 100, 500),
        'max_depth': trial.suggest_int('max_depth', 3, 10),
        'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3),
        'subsample': trial.suggest_float('subsample', 0.6, 1.0),
        'colsample_bytree': trial.suggest_float('colsample_bytree', 0.6, 1.0),
    }
    model = XGBClassifier(**params, use_label_encoder=False, eval_metric='logloss')
    return cross_val_score(model, X, y, cv=5, scoring='accuracy').mean()

study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=50)

print("Best params:", study.best_params)
print("Best accuracy:", study.best_value)

best_model = XGBClassifier(**study.best_params, use_label_encoder=False, eval_metric='logloss')
best_model.fit(X, y)
joblib.dump(best_model, 'model.pkl')
joblib.dump(best_model.feature_importances_, 'feature_importance.pkl')
print("model.pkl and feature_importance.pkl saved")