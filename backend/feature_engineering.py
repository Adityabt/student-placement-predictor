import pandas as pd

def engineer_features(df):
    # Composite academic score — combines school + college performance
    df['academic_score'] = (
        df['SSC_Marks'] * 0.25 +
        df['HSC_Marks'] * 0.25 +
        df['CGPA'] * 10 * 0.5   # scale CGPA (0-10) to 0-100 range before combining
    )

    # Composite employability score — combines technical readiness signals
    df['employability_score'] = (
        df['TechnicalSkillScore'] * 0.3 +
        df['CodingPlatformScore'] * 0.3 +
        df['GitHubScore'] * 10 * 0.2 +   # scale GitHub score (0-10) to 0-100
        df['AptitudeTestScore'] * 0.2
    )

    # Practical exposure — internships + projects + workshops combined
    df['practical_exposure'] = (
        df['Internships'] + df['Projects'] + df['Workshops/Certifications']
    )

    return df