import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardCliente from './pages/client/DashboardCliente';
import SocioPage from './pages/client/SocioPage';  // ← IMPORTANTE: Agregar esta línea

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<DashboardCliente />} />
        
        {/* 👇 NUEVA RUTA 👇 */}
        <Route path="/socio" element={<SocioPage />} />
        
        {/* Resto de rutas de tus compañeros... */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;