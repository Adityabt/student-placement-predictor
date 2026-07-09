import pandas as pd

def engineer_features(df):
    df['academic_score'] = (
        df['ssc_p'] * 0.2 +
        df['hsc_p'] * 0.25 +
        df['degree_p'] * 0.3 +
        df['mba_p'] * 0.25
    )
    df['has_workex'] = df['workex'].map({'Yes': 1, 'No': 0})
    return df