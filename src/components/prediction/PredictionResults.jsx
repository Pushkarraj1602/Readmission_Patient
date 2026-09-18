import React from "react";
import Card from "../common/Card";
import { RiskScore, RiskBadge, SimilarCaseCard } from "./RiskIndicators";
import { PatientSummary, ClinicalInsight } from "./InsightCards";
import { Activity, Clock } from "lucide-react";

const PredictionResults = ({ data }) => {
  if (!data) return null;

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <RiskScore probability={data.risk_probability} />
        <RiskBadge isHighRisk={data.is_high_risk} />
        <SimilarCaseCard rate={data.similar_case_readmit_rate} />
      </div>

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
