import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PredictionPage from "./pages/PredictionPage";
import SettingsPage from "./pages/SettingsPage";
import PatientHistoryPage from "./pages/PatientHistoryPage";
import ModelInfoPage from "./pages/ModelInfoPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PredictionPage />} />
        <Route path="/history" element={<PatientHistoryPage />} />
        <Route path="/model-info" element={<ModelInfoPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;