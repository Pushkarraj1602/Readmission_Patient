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
  });

  const update = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleReset = () => {
    setForm({
      age: 65, gender: "Male", diag_1: "Circulatory", time_in_hospital: 4,
      num_lab_procedures: 40, num_procedures: 1, n_inpatient: 0, n_emergency: 0,
      n_outpatient: 0, num_medications: 15, number_diagnoses: 7, insulin: "No",
    });
  };

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-border)]">
        <div className="w-12 h-12 rounded-xl bg-[var(--color-mint)] flex items-center justify-center text-[var(--color-forest)]">
          <Home size={24} />
        </div>
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--color-text-primary)]">Patient Information</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">Enter the patient details below to predict readmission risk</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
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
