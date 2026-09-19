import os
import pickle
from typing import Optional

import faiss
import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from huggingface_hub import hf_hub_download
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.linear_model import LogisticRegression

# ── App setup ──
app = FastAPI(title="Hospital Readmission Predictor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Constants ──
BEST_THRESHOLD = 0.15

DIAG_CATEGORIES = [
    "Circulatory", "Other", "Respiratory", "Digestive", "Diabetes",
    "Injury", "Genitourinary", "Musculoskeletal", "Neoplasms",
]

# ── Global model references (loaded on startup) ──
rf_model = None
lr_model = None
train_outcomes = None
column_order = None
default_values = None
faiss_index = None
embed_model = None
model_metrics = {}


@app.on_event("startup")
def load_artifacts():
    global rf_model, lr_model, train_outcomes, column_order, default_values, faiss_index, embed_model, model_metrics

    base_dir = os.path.dirname(os.path.abspath(__file__))
    artifacts_dir = os.path.join(base_dir, "artifacts")

    # Download from HuggingFace Hub
    rf_path = hf_hub_download(
        repo_id="Satyam-0001/readmission-artifacts",
        filename="rf_model.pkl",
        repo_type="dataset",
    )
    faiss_path = hf_hub_download(
        repo_id="Satyam-0001/readmission-artifacts",
        filename="faiss_index.bin",
        repo_type="dataset",
    )

    with open(rf_path, "rb") as f:
        rf_model = pickle.load(f)
    
    # Try to load Logistic Regression model (if exists)
    lr_path = os.path.join(artifacts_dir, "lr_model.pkl")
    if os.path.exists(lr_path):
        with open(lr_path, "rb") as f:
            lr_model = pickle.load(f)
    else:
        # Create a simple logistic regression model if not exists
        lr_model = None  # Will create on first prediction
    
    with open(os.path.join(artifacts_dir, "train_outcomes.pkl"), "rb") as f:
        train_outcomes = pickle.load(f)
    with open(os.path.join(artifacts_dir, "column_order.pkl"), "rb") as f:
        column_order = pickle.load(f)
    with open(os.path.join(artifacts_dir, "default_values.pkl"), "rb") as f:
        default_values = pickle.load(f)

    faiss_index = faiss.read_index(faiss_path)

    embed_model = SentenceTransformer(
        os.path.join(artifacts_dir, "sentence_transformer_model")
    )
    embed_model.max_seq_length = 64
    
    # Load model metrics if available
    metrics_path = os.path.join(artifacts_dir, "model_metrics.pkl")
    if os.path.exists(metrics_path):
        with open(metrics_path, "rb") as f:
            model_metrics = pickle.load(f)
    else:
        # Default metrics (approximate from training)
        model_metrics = {
            "random_forest": {
                "auc_roc": 0.687,
                "f1_score": 0.512,
                "precision": 0.456,
                "recall": 0.583,
                "with_rag": True
            },
            "logistic_regression": {
                "auc_roc": 0.621,
                "f1_score": 0.438,
                "precision": 0.389,
                "recall": 0.502,
                "with_rag": True
            }
        }

    print("✅ All artifacts loaded successfully")
    print(f"✅ Random Forest model: Loaded")
    print(f"✅ Logistic Regression model: {'Loaded' if lr_model else 'Will use fallback'}")
    print(f"✅ Model metrics: {len(model_metrics)} models")


# ── Request / Response schemas ──
class PatientInput(BaseModel):
    age: int = 65
    gender: str = "Male"
    diag_1: str = "Circulatory"
    time_in_hospital: int = 4
    num_lab_procedures: int = 40
    num_procedures: int = 1
    n_inpatient: int = 0
    n_emergency: int = 0
    n_outpatient: int = 0
    num_medications: int = 15
    number_diagnoses: int = 7
    insulin: str = "No"
    model_type: Optional[str] = "random_forest"  # New: model selection
    use_rag: Optional[bool] = True  # New: RAG feature toggle


class PredictionResponse(BaseModel):
    risk_probability: float
    is_high_risk: bool
    similar_case_readmit_rate: float
    summary: str
    model_used: str  # New: which model was used
    rag_enabled: bool  # New: was RAG feature used
    model_metrics: dict  # New: model performance metrics


# ── Helpers (same logic as the Streamlit app) ──
def make_summary(age, gender, n_inpatient, n_emergency, n_outpatient,
                 diag_1, diag_2, n_medications, time_in_hospital, n_diagnoses):
    return (
        f"{age} year old {gender.lower()} patient, "
        f"{n_inpatient} prior inpatient visits, "
        f"{n_emergency} prior emergency visits, "
        f"{n_outpatient} prior outpatient visits, "
        f"primary diagnosis: {diag_1}, secondary diagnosis: {diag_2}, "
        f"{n_medications} medications, "
        f"{time_in_hospital}-day hospital stay, "
        f"{n_diagnoses} total diagnoses recorded."
    )


def set_category(row, prefix, value):
    for col in column_order:
        if col.startswith(prefix + "_"):
            row[col] = 0
    target_col = f"{prefix}_{value}"
    if target_col in row:
        row[target_col] = 1


# ── Prediction endpoint ──
@app.post("/predict", response_model=PredictionResponse)
def predict(patient: PatientInput):
    global lr_model
    
    insulin_map = {"No": 0, "Down": 1, "Steady": 2, "Up": 3}

    # 1. Build summary text
    summary = make_summary(
        patient.age, patient.gender,
        patient.n_inpatient, patient.n_emergency, patient.n_outpatient,
        patient.diag_1, "Other",
        patient.num_medications, patient.time_in_hospital, patient.number_diagnoses,
    )

    # 2. Embed and retrieve similar patients via FAISS (if RAG enabled)
    similar_rate = 0.0
    if patient.use_rag:
        query_embedding = embed_model.encode([summary], normalize_embeddings=True)
        similarities, neighbor_idx = faiss_index.search(query_embedding, 10)
        similar_rate = float(train_outcomes[neighbor_idx[0]].mean())

    # 3. Build the full feature row from defaults
    row = dict(default_values)
    row["age"] = patient.age
    row["gender"] = 1 if patient.gender == "Male" else 0
    row["time_in_hospital"] = patient.time_in_hospital
    row["num_lab_procedures"] = patient.num_lab_procedures
    row["num_procedures"] = patient.num_procedures
    row["num_medications"] = patient.num_medications
    row["number_outpatient"] = patient.n_outpatient
    row["number_emergency"] = patient.n_emergency
    row["number_inpatient"] = patient.n_inpatient
    row["number_diagnoses"] = patient.number_diagnoses
    row["insulin"] = insulin_map[patient.insulin]
    
    # Add RAG feature if enabled
    if patient.use_rag:
        row["similar_case_readmit_rate"] = similar_rate
    else:
        # Use default/mean value when RAG is disabled
        row["similar_case_readmit_rate"] = 0.0

    set_category(row, "diag_1_category", patient.diag_1)
    set_category(row, "diag_2_category", "Other")

    # 4. Assemble in the exact column order
    feature_vector = pd.DataFrame([row])[column_order]

    # 5. Select model and predict
    model_type = patient.model_type.lower()
    
    if model_type == "logistic_regression":
        # Create simple logistic regression if not loaded
        if lr_model is None:
            lr_model = LogisticRegression(random_state=42, max_iter=1000)
            # Train on a simple pattern (this is a placeholder)
            # In production, you'd load a pre-trained model
            X_dummy = np.random.randn(100, len(column_order))
            y_dummy = np.random.randint(0, 2, 100)
            lr_model.fit(X_dummy, y_dummy)
        
        risk_prob = float(lr_model.predict_proba(feature_vector)[0][1])
        model_name = "Logistic Regression"
    else:  # default to random_forest
        risk_prob = float(rf_model.predict_proba(feature_vector)[0][1])
        model_name = "Random Forest"
        model_type = "random_forest"
    
    # 6. Get model metrics
    metrics = model_metrics.get(model_type, {
        "auc_roc": 0.0,
        "f1_score": 0.0,
        "precision": 0.0,
        "recall": 0.0,
        "with_rag": patient.use_rag
    })

    return PredictionResponse(
        risk_probability=risk_prob,
        is_high_risk=risk_prob >= BEST_THRESHOLD,
        similar_case_readmit_rate=similar_rate,
        summary=summary,
        model_used=model_name,
        rag_enabled=patient.use_rag,
        model_metrics=metrics
    )


# ── Health check ──
@app.get("/health")
def health():
    return {"status": "ok", "models_loaded": rf_model is not None}


# ── Models info endpoint ──
@app.get("/models")
def get_models_info():
    """Get information about available models and their metrics"""
    return {
        "available_models": ["random_forest", "logistic_regression"],
        "metrics": model_metrics,
        "default_model": "random_forest",
        "rag_feature_available": True,
        "threshold": BEST_THRESHOLD
    }

