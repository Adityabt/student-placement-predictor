
# HireSense

Predicts whether a student is likely to be placed, based on academic performance, technical readiness, practical experience, and career preferences — with SHAP-based explainability so every prediction shows *why*, not just what.

**Live app:** _add your Vercel URL here_
**API:** _add your Render URL here_

---

## What it does

HireSense takes a student's profile — CGPA, backlogs, internships, coding scores, portfolio presence, expected CTC, and more — and returns:

- A **placement prediction** (placed / not placed) with a confidence score
- **SHAP values** for every input feature, showing exactly how much each one pushed the prediction up or down
- **Engineered scores** (academic score, employability score, practical exposure) for a quick-glance profile summary
- A dataset-wide **analysis view** — placement rate by branch, by CGPA band, and global/grouped feature importance across the whole training set

## Tech stack

**Frontend**

- React + Vite
- Modular components (prediction form, analysis dashboard, profile breakdown)

**Backend**

- FastAPI (Python)
- CatBoost model, tuned via Optuna
- SHAP (`TreeExplainer`) for per-prediction explainability
- pandas / scikit-learn for feature engineering and preprocessing

**Deployment**

- Frontend on **Vercel**
- Backend on **Render**

## Model

- Trained on a 10k-row, 20-column dataset of student academic and career-readiness data
- Held-out test accuracy: **~85%** (best CV accuracy 83.53%) after Optuna hyperparameter tuning
- Fixed an early data leakage bug by dropping `InterviewRoundsCleared` and `CompanyTier`, and resolved multicollinearity from composite features
- Feature set spans four groups: **Academic Performance**, **Test & Prep Readiness**, **Extracurricular & Soft Skills**, and **Practical Experience & Career Preferences** (portfolio, relocation willingness, preferred role, expected CTC)

## Project structure

```
student-placement-predictor/
├── backend/
│   ├── main.py                  # FastAPI app — /predict and /analysis endpoints
│   ├── feature_engineering.py   # Derived feature computation
│   ├── model.pkl                # Trained CatBoost model
│   ├── shap_explainer.pkl       # Fitted SHAP TreeExplainer
│   ├── feature_importance.pkl   # Precomputed global feature importances
│   ├── placement_clean.csv      # Cleaned training dataset
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/          # PredictForm, analysis tabs, profile cards
    │   └── assets/
    └── public/
        └── favicon.png
```

## Running locally

**Backend**

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL` in a `frontend/.env` file to point at your local backend (e.g. `http://localhost:8000`) or your deployed Render URL.

## API

**`POST /predict`**
Accepts a student profile, returns prediction, confidence, per-feature SHAP values, and engineered scores.

**`GET /analysis`**
Returns dataset-wide stats: placement rate, average CGPA, global and grouped feature importance, branch-wise and CGPA-band placement rates.

## Credits

Built by [Aditya](https://github.com/Adityabt) with [Jiya](https://github.com/) as a collaborative ML project.
