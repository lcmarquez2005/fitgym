import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SocioPage from "./pages/SocioPage"; 
import Dashboard from "./pages/Dashboard"; // <--- ¡ESTA LÍNEA FALTABA!

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal (Login o Socio) */}
        <Route path="/" element={<SocioPage />} />
        
        {/* Nueva ruta para ver el menú lateral */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;