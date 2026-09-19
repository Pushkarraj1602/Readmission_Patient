import React, { useState } from "react";
import { RotateCcw, Sparkles, Home, User, Stethoscope, TestTube, Scissors, BedDouble, AlertCircle, Users, ClipboardList, Syringe, Calendar } from "lucide-react";
import Card from "../common/Card";
import { FormField, SelectInput, NumberInput } from "./FormField";

const DIAG_CATEGORIES = [
  "Circulatory", "Other", "Respiratory", "Digestive", "Diabetes",
  "Injury", "Genitourinary", "Musculoskeletal", "Neoplasms",
];
const AGE_OPTIONS = [5, 15, 25, 35, 45, 55, 65, 75, 85, 95];
const INSULIN_OPTIONS = ["No", "Down", "Steady", "Up"];

const PatientForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({
    patient_name: "",
    age: 65,
    gender: "Male",
    diag_1: "Circulatory",
    time_in_hospital: 4,
    num_lab_procedures: 40,
    num_procedures: 1,
    n_inpatient: 0,
    n_emergency: 0,
    n_outpatient: 0,
    num_medications: 15,
    number_diagnoses: 7,
    insulin: "No",
    model_type: "random_forest", // New: model selection
    use_rag: true, // New: RAG feature toggle
  });

  const update = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleReset = () => {
    setForm({
      patient_name: "",
      age: 65, gender: "Male", diag_1: "Circulatory", time_in_hospital: 4,
      num_lab_procedures: 40, num_procedures: 1, n_inpatient: 0, n_emergency: 0,
      n_outpatient: 0, num_medications: 15, number_diagnoses: 7, insulin: "No",
      model_type: "random_forest", use_rag: true,
    });
  };

  return (
    <Card className="flex flex-col h-full">
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
        {/* Patient Name Field */}
        <div className="mb-6">
          <FormField label="Patient Name" icon={User}>
            <input
              type="text"
              value={form.patient_name}
              onChange={(e) => update("patient_name")(e.target.value)}
              placeholder="Enter patient full name"
              className="w-full px-4 py-3 bg-white border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)] text-[var(--color-text-primary)]"
              required
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-8">
          <FormField label="Age" icon={User}>
            <SelectInput value={form.age} onChange={(v) => update("age")(Number(v))} options={AGE_OPTIONS} />
          </FormField>
          
          <FormField label="Gender" icon={User}>
            <SelectInput value={form.gender} onChange={update("gender")} options={["Male", "Female"]} />
          </FormField>

          <FormField label="Primary Diagnosis (diag_1)" icon={Stethoscope}>
            <SelectInput value={form.diag_1} onChange={update("diag_1")} options={DIAG_CATEGORIES} />
          </FormField>

          <FormField label="Length of Stay (days)" icon={Calendar}>
            <NumberInput value={form.time_in_hospital} onChange={update("time_in_hospital")} min={1} max={14} />
          </FormField>

          <FormField label="Number of Lab Procedures" icon={TestTube}>
            <NumberInput value={form.num_lab_procedures} onChange={update("num_lab_procedures")} min={0} max={132} />
          </FormField>

          <FormField label="Number of Procedures" icon={Scissors}>
            <NumberInput value={form.num_procedures} onChange={update("num_procedures")} min={0} max={6} />
          </FormField>

          <FormField label="Prior Inpatient Visits" icon={BedDouble}>
            <NumberInput value={form.n_inpatient} onChange={update("n_inpatient")} min={0} max={20} />
          </FormField>

          <FormField label="Prior Emergency Visits" icon={AlertCircle}>
            <NumberInput value={form.n_emergency} onChange={update("n_emergency")} min={0} max={20} />
          </FormField>

          <FormField label="Prior Outpatient Visits" icon={Users}>
            <NumberInput value={form.n_outpatient} onChange={update("n_outpatient")} min={0} max={20} />
          </FormField>

          <FormField label="Number of Medications" icon={ClipboardList}>
            <NumberInput value={form.num_medications} onChange={update("num_medications")} min={1} max={80} />
          </FormField>

          <FormField label="Number of Diagnoses" icon={ClipboardList}>
            <NumberInput value={form.number_diagnoses} onChange={update("number_diagnoses")} min={1} max={16} />
          </FormField>

          <FormField label="Insulin" icon={Syringe}>
            <SelectInput value={form.insulin} onChange={update("insulin")} options={INSULIN_OPTIONS} />
          </FormField>
        </div>

        {/* Model Configuration */}
        <div className="mb-6 p-5 rounded-xl bg-gradient-to-br from-[var(--color-mint)] via-white to-[var(--color-sky)] border-2 border-[var(--color-forest)]/10 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-forest)] flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <h3 className="text-base font-bold text-[var(--color-forest)]">Model Configuration</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ML Model Selection Card */}
            <div className="bg-white rounded-lg p-4 border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-[var(--color-forest)]" />
                <label className="text-sm font-semibold text-[var(--color-text-primary)]">ML Model</label>
              </div>
              <select
                value={form.model_type}
                onChange={(e) => update("model_type")(e.target.value)}
                className="w-full px-3 py-2.5 bg-[var(--color-mint)]/20 border border-[var(--color-forest)]/20 rounded-lg text-sm font-medium text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)] focus:border-transparent transition-all cursor-pointer"
              >
                <option value="random_forest">🌲 Random Forest (Recommended)</option>
                <option value="logistic_regression">📊 Logistic Regression</option>
              </select>
              <p className="text-xs text-[var(--color-text-secondary)] mt-2">
                {form.model_type === "random_forest" ? "High accuracy ensemble method" : "Fast linear classification model"}
              </p>
            </div>
            
            {/* RAG Feature Card */}
            <div className="bg-white rounded-lg p-4 border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <Users size={16} className="text-[var(--color-forest)]" />
                <label className="text-sm font-semibold text-[var(--color-text-primary)]">Similar Cases Analysis</label>
              </div>
              <label className="relative inline-flex items-center cursor-pointer w-full">
                <input
                  type="checkbox"
                  checked={form.use_rag}
                  onChange={(e) => update("use_rag")(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-3 peer-focus:ring-[var(--color-mint)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-forest)] shadow-inner"></div>
                <span className="ml-3 text-sm font-semibold text-[var(--color-text-primary)]">
                  {form.use_rag ? "✓ Enabled" : "✗ Disabled"}
                </span>
              </label>
              <p className="text-xs text-[var(--color-text-secondary)] mt-2">
                {form.use_rag 
                  ? "Using RAG to find similar patient cases" 
                  : "Prediction without historical case analysis"}
              </p>
            </div>
          </div>
          
          {/* Info Banner */}
          <div className={`mt-4 px-4 py-2.5 rounded-lg ${form.use_rag ? 'bg-[var(--color-forest)]/10 border border-[var(--color-forest)]/20' : 'bg-orange-50 border border-orange-200'}`}>
            <p className="text-xs font-medium text-[var(--color-text-primary)] flex items-center gap-2">
              {form.use_rag ? (
                <>
                  <span className="text-green-600 font-bold">✓</span>
                  Enhanced accuracy mode: Analyzing similar historical cases to improve prediction reliability
                </>
              ) : (
                <>
                  <span className="text-orange-500 font-bold">⚠</span>
                  Standard mode: Predictions based on model training only (similar case analysis disabled)
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            type="button" 
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-[var(--color-border)] rounded-[14px] text-[var(--color-text-primary)] font-semibold hover:bg-[var(--color-mint)] transition-colors w-1/3"
          >
            <RotateCcw size={18} />
            Reset
          </button>
          
          <button 
            type="submit" 
            disabled={loading}
            className="predict-btn flex-1"
          >
            <Sparkles size={18} />
            {loading ? "Analyzing..." : "Predict Readmission Risk"}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default PatientForm;
