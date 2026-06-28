import pandas as pd
from sklearn.preprocessing import LabelEncoder

# ── Load Raw Data ──────────────────────────────────────────
df = pd.read_csv('placement_raw.csv')
print("Original shape:", df.shape)

# ── Drop StudentID ─────────────────────────────────────────
# Just an identifier, no predictive value
df = df.drop('StudentID', axis=1)

# ── Handle CompanyTier Nulls ───────────────────────────────
# Not-placed students have no company tier — fill with 'None'
df['CompanyTier'] = df['CompanyTier'].fillna('None')

# ── Encode Categorical Columns ─────────────────────────────
le = LabelEncoder()

df['Gender'] = le.fit_transform(df['Gender'])
print("Gender classes:", le.classes_)        # Female=0, Male=1

df['Branch'] = le.fit_transform(df['Branch'])
print("Branch classes:", le.classes_)        # Civil=0, CSE=1, ECE=2, EEE=3, IT=4, Mechanical=5

df['ExtracurricularActivities'] = le.fit_transform(df['ExtracurricularActivities'])
print("ExtracurricularActivities classes:", le.classes_)   # No=0, Yes=1

df['PlacementTraining'] = le.fit_transform(df['PlacementTraining'])
print("PlacementTraining classes:", le.classes_)           # No=0, Yes=1

df['CompanyTier'] = le.fit_transform(df['CompanyTier'])
print("CompanyTier classes:", le.classes_)  # None=0, Tier1=1, Tier2=2, Tier3=3

df['PlacementStatus'] = le.fit_transform(df['PlacementStatus'])
print("PlacementStatus classes:", le.classes_)  # NotPlaced=0, Placed=1

# ── Save Cleaned Data ──────────────────────────────────────
df.to_csv('placement_clean.csv', index=False)

print("\n✅ placement_clean.csv saved")
print("Shape:", df.shape)
print("\n", df.dtypes)
print("\n", df.head())