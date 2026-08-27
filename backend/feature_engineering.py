import pandas as pd

def engineer_features(df):
    # Kept for DISPLAY only now (feeds engineered_scores in /predict response
    # for the frontend's gauge/chart components). No longer used as model
    # training input — see hyperparameter_tune.py for why.
    df['academic_score'] = (
        df['SSC_Marks'] * 0.25 +
        df['HSC_Marks'] * 0.25 +
        df['CGPA'] * 10 * 0.5
    )

    df['employability_score'] = (
        df['TechnicalSkillScore'] * 0.3 +
        df['CodingPlatformScore'] * 0.3 +
        df['GitHubScore'] * 10 * 0.2 +
        df['AptitudeTestScore'] * 0.2
    )

    df['practical_exposure'] = (
        df['Internships'] + df['Projects'] + df['Workshops/Certifications']
    )

    return df