import React from "react";
import { useNavigate } from "react-router-dom";
import { UserRound, ChevronDown } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center mb-0">
      <div>
         <h1 className="text-xl font-bold font-display text-[var(--color-text-primary)] tracking-tight">
           READMISSION RISK PREDICTION
         </h1>
      </div>
      
      <div className="flex items-center gap-5">
        <div className="hidden md:flex flex-col items-center">
            <span className="font-script text-xl text-[var(--color-forest)]">Patients First, Always</span>
            <div className="w-20 h-px bg-[var(--color-border)] mt-0.5"></div>
        </div>

        <button 
          onClick={() => navigate("/settings")}
          className="flex items-center gap-2.5 bg-white px-3 py-1.5 rounded-full border border-[var(--color-border)] shadow-xs hover:shadow-sm hover:border-[var(--color-sage)] transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-[var(--color-forest)] flex items-center justify-center text-[var(--color-mint)]">
            <UserRound size={16} />
          </div>
          <div className="flex flex-col mr-1 text-left">
            <span className="text-xs font-semibold text-[var(--color-text-primary)] leading-tight">Dr.Raj</span>
            <span className="text-[10px] text-[var(--color-text-muted)] leading-tight">Hospital Physician</span>
          </div>
          <ChevronDown size={14} className="text-[var(--color-text-muted)]" />
        </button>
      </div>
    </header>
  );
};

export default Header;
