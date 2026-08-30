
# HireSense

Predicts whether a student is likely to be placed, based on academic performance, technical readiness, practical experience, and career preferences — with SHAP-based explainability so every prediction shows *why*, not just what.

![Python](https://img.shields.io/badge/python-3.9-3776AB?logo=python&logoColor=white)
![React](https://img.shields.io/badge/react-18-61DAFB?logo=react&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?logo=fastapi)
![CatBoost](https://img.shields.io/badge/model-CatBoost-FFCC00)

**Live app:** _add your Vercel URL here_
**API:** _add your Render URL here_

---

## What it does

HireSense takes a student's profile — CGPA, backlogs, internships, coding scores, portfolio presence, expected CTC, and more — and returns:

- A **placement prediction** (placed / not placed) with a confidence score
- **SHAP values** for every input feature, showing exactly how much each one pushed the prediction up or down
- **Engineered scores** (academic score, employability score, practical exposure) for a quick-glance profile summary — computed for display only, not fed back into the model
- A dataset-wide **analysis view** — placement rate by branch, by CGPA band, and global/grouped feature importance across the whole training set

## Tech stack

**Frontend**

- React (Vite) + React Router — four routes: Home, Predict, Analysis, About
- Tailwind CSS + Framer Motion for layout, motion, and interaction design

**Backend**

- FastAPI (Python)
- CatBoost model, tuned via Optuna, with native categorical handling for `Branch` / `Gender` / `WillingToRelocate` / `PreferredRoleCategory`
- SHAP (`TreeExplainer`) for per-prediction explainability
- pandas / scikit-learn for feature engineering and preprocessing

**Deployment**

- Frontend on **Vercel**
- Backend on **Render**

## Model

- Trained on a **15,200-row, 20-column** dataset spanning academic performance, technical readiness, practical experience, and career preferences
- Held-out test accuracy: **84.7%** (best CV accuracy 83.4%) after Optuna hyperparameter tuning (50 trials)
- Fixed an early data leakage bug by dropping `InterviewRoundsCleared` and `CompanyTier`, and resolved multicollinearity by training on granular raw features instead of pre-aggregated composite scores — the composites are still computed for the UI, they just aren't fed into the model
- Feature set spans four groups: **Academic Performance**, **Test & Prep Readiness**, **Extracurricular & Soft Skills**, and **Practical Experience & Career Preferences** (portfolio, relocation willingness, preferred role, expected CTC)

## Project structure

```
student-placement-predictor/
├── backend/
│   ├── main.py                  # FastAPI app — /predict and /analysis endpoints
│   ├── feature_engineering.py   # Derived/display-only feature computation
│   ├── hyperparameter_tune.py   # Optuna tuning + production model training
│   ├── model.pkl                # Trained CatBoost model
│   ├── shap_explainer.pkl       # Fitted SHAP TreeExplainer
│   ├── feature_importance.pkl   # Precomputed global feature importances
│   ├── placement_clean.csv      # Cleaned training dataset
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── pages/                # PredictForm, AnalysisSection, About — one per route
    │   ├── components/           # Navbar, HeroSection, HowItWorks, WhyHireSense, GlowCard, SectionDivider
    │   ├── lib/
    │   │   └── motionVariants.js # Shared Framer Motion variants (stagger, fadeUp)
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

The frontend currently points at the backend via a hardcoded `const API = "http://localhost:8000"` constant in `PredictForm.jsx` and `AnalysisSection.jsx`. To run against a deployed backend, update that constant directly (or, better, migrate it to `import.meta.env.VITE_API_URL` and set that in a `frontend/.env` file — this isn't wired up yet, but it's the natural next step before shipping).

## API

**`POST /predict`**
Accepts a student profile, returns prediction, confidence, per-feature SHAP values, and engineered scores.

**`GET /analysis`**
Returns dataset-wide stats: placement rate, average CGPA, global and grouped feature importance, branch-wise and CGPA-band placement rates.

## Credits

Built as a collaborative engineering project by:

- **[Aditya Thakur](https://github.com/Adityabt)** — ML pipeline (CatBoost, Optuna tuning), FastAPI backend, SHAP explainability, analysis dashboard
- **[Jiya](https://github.com/jiyagithub)** — data cleaning, prediction flow, frontend polish, deployment
