# MediMind — Hospital Readmission Risk Prediction Frontend

MediMind is a modern, AI-powered clinical decision support web application designed to evaluate patient readmission risks, assist healthcare professionals with data-driven insights, and optimize discharge planning.

---

## 🚀 Features

- **Interactive Patient Assessment Form**:
  - Input clinical parameters including age, gender, primary diagnosis, hospital stay duration, medication counts, lab procedures, prior inpatient/emergency visits, and insulin usage.
  - Quick form reset and default sample pre-fills.

- **AI-Powered Prediction Engine Integration**:
  - Connects to a FastAPI machine learning backend utilizing Random Forest classification and FAISS vector similarity search.
  - Interactive 2-second loading animation step-by-step indicator showing AI inference progress.

- **Visual Risk Dashboard & Indicators**:
  - **Readmission Risk Probability**: Displays exact percentage score with color-coded risk meter.
  - **Risk Categorization**: Clear High Risk / Low Risk badges based on clinical thresholds.
  - **Similar Case Cohort Analysis**: Displays readmission rate across 10 similar historical patient cases.

- **Clinical Summaries & Recommendations**:
  - Auto-generated patient summary with copy-to-clipboard functionality.
  - Dynamic clinical guidance tailored to patient risk level.

- **User & Doctor Settings**:
  - Profile customization (Name, Email, Phone, Role, Department, Hospital).
  - Notification preference toggles (Email alerts, High-risk alerts, Weekly reports, System updates).
  - Appearance preferences & Security actions.

- **Modern & Responsive UI/UX**:
  - Fixed sidebar with quick navigation and MediMind branding.
  - Fixed compact top navigation header.
  - Built with TailwindCSS v4 and Lucide icons for a clean healthcare aesthetic.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Linting**: [Oxlint](https://oxc-project.github.io/)

---

## 📁 Project Structure

```text
Frontend/
├── .env.example              # Sample environment configuration
├── .env                      # Local environment configuration
├── index.html                # Entry HTML file
├── package.json              # Dependencies and NPM scripts
├── vite.config.js            # Vite configuration
└── src/
    ├── main.jsx              # React app entry point
    ├── App.jsx               # Application routes setup
    ├── index.css             # TailwindCSS & global styles
    ├── assets/               # Local images & logo branding
    ├── components/
    │   ├── common/           # Generic UI components (Card, Button, etc.)
    │   ├── layout/           # DashboardLayout, Sidebar, Header
    │   ├── patient/          # PatientForm, FormFields
    │   └── prediction/       # PredictionResults, RiskIndicators, InsightCards,
    │                         # PredictionInitialState, PredictionLoadingState
    ├── hooks/
    │   └── usePrediction.js  # Prediction state management hook
    ├── pages/
    │   ├── PredictionPage.jsx # Main Dashboard & Prediction page
    │   └── SettingsPage.jsx   # Doctor Profile & System Settings
    └── services/
        └── predictionApi.js   # API service layer for backend HTTP requests
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the `Frontend` directory (or copy from `.env.example`):

```env
VITE_BACKEND_URL=http://localhost:8000
```

---

## 💻 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

1. **Clone the repository & navigate to the Frontend folder**:
   ```bash
   cd Frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`.

### Production Build

To compile a production-ready build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 🔗 Backend API Requirement

This frontend connects to the FastAPI backend service (`api.py`). Ensure the backend is running on `http://localhost:8000` (or update `VITE_BACKEND_URL` in `.env` accordingly).

Endpoint expected:
- `POST /predict` — Accepts JSON payload of patient parameters and returns risk probability, similarity rate, and patient summary.
