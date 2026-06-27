import pandas as pd
from sklearn.preprocessing import LabelEncoder
df = pd.read_csv('placement_raw.csv')
print(df.info())
print(df.isnull().sum())
df = df.drop(columns=['salary'])
df['workex'] = df['workex'].map({'Yes': 1, 'No': 0})
df['gender'] = df['gender'].map({'M': 1, 'F': 0})
df['status'] = df['status'].map({'Placed': 1, 'Not Placed': 0})
le = LabelEncoder()
for col in ['ssc_b', 'hsc_b', 'hsc_s', 'degree_t', 'specialisation']:
    df[col] = le.fit_transform(df[col])
df.to_csv('placement_clean.csv', index=False)
print("✅ Cleaned dataset saved as placement_clean.csv")
print(df.head())