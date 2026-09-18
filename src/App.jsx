import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PredictionPage from "./pages/PredictionPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PredictionPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;