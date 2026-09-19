import React from "react";
import Card from "../common/Card";
import { RiskScore, RiskBadge, SimilarCaseCard } from "./RiskIndicators";
import { PatientSummary, ClinicalInsight } from "./InsightCards";
import { Activity, Clock, Brain, Target, TrendingUp, Award, Download } from "lucide-react";

const PredictionResults = ({ data }) => {
  if (!data) return null;

  const metrics = data.model_metrics || {};

  const handleDownloadReport = async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(`${BACKEND_URL}/generate-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      const result = await response.json();
      
      // Create a blob and download
      const blob = new Blob([result.report], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report. Please try again.");
    }
  };

  return (
    <Card className="flex flex-col h-full bg-[#FCFDFB]">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-amber-light)] flex items-center justify-center text-[var(--color-amber)]">
            <Activity size={24} />
          </div>
          <div>
            <h2 className="text-[16px] font-semibold text-[var(--color-text-primary)]">Prediction Results</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">AI-powered analysis based on patient data and similar historical cases</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F4F3EC] rounded-lg text-xs font-semibold text-[var(--color-text-secondary)]">
          <Clock size={14} />
          Just now
        </div>
      </div>

      {/* Model Info Badge */}
      <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-blue-600" />
          <span className="text-sm font-semibold text-blue-900">Model: {data.model_used || 'Random Forest'}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-blue-600" />
            <span className="text-xs text-blue-700">
              RAG: {data.rag_enabled ? '✓ Enabled' : '✗ Disabled'}
            </span>
          </div>
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={14} />
            Download Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <RiskScore probability={data.risk_probability} />
        <RiskBadge isHighRisk={data.is_high_risk} />
        <SimilarCaseCard rate={data.similar_case_readmit_rate} />
      </div>

      {/* Model Performance Info - Optional Display */}
      {metrics && Object.keys(metrics).length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-blue-600" />
              <h3 className="text-sm font-semibold text-blue-900">Model Training Performance</h3>
            </div>
            <span className="text-xs text-blue-600 italic">Overall metrics from training dataset</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {metrics.auc_roc !== undefined && (
              <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                <div className="text-xs text-blue-600 mb-1">AUC-ROC</div>
                <div className="text-lg font-bold text-blue-900">{(metrics.auc_roc * 100).toFixed(1)}%</div>
              </div>
            )}
            {metrics.f1_score !== undefined && (
              <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                <div className="text-xs text-blue-600 mb-1">F1 Score</div>
                <div className="text-lg font-bold text-blue-900">{(metrics.f1_score * 100).toFixed(1)}%</div>
              </div>
            )}
            {metrics.precision !== undefined && (
              <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                <div className="text-xs text-blue-600 mb-1">Precision</div>
                <div className="text-lg font-bold text-blue-900">{(metrics.precision * 100).toFixed(1)}%</div>
              </div>
            )}
            {metrics.recall !== undefined && (
              <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                <div className="text-xs text-blue-600 mb-1">Recall</div>
                <div className="text-lg font-bold text-blue-900">{(metrics.recall * 100).toFixed(1)}%</div>
              </div>
            )}
          </div>
          <p className="text-xs text-blue-700 mt-2 italic">
            ℹ️ These metrics represent the model's performance on the test dataset during training, not this specific prediction.
          </p>
        </div>
      )}

      <div className="space-y-6">
        <PatientSummary summary={data.summary} />
        <ClinicalInsight isHighRisk={data.is_high_risk} />
      </div>

      <div className="mt-8 flex justify-between items-center px-4 py-4 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-2 text-[var(--color-sage)]">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
           <span className="text-sm italic font-medium">Empowering clinicians with intelligent insights<br/>for better patient outcomes.</span>
        </div>
        <div className="text-right text-[10px] text-[var(--color-text-muted)] font-semibold uppercase tracking-widest leading-relaxed">
          Care<br/>Predict<br/>Prevent<br/>Together
        </div>
      </div>
    </Card>
  );
};

export default PredictionResults;
