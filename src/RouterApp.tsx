import { Routes, Route } from 'react-router-dom';
import Planes from './pages/client/Planes';
import LandingPage from './pages/client/Bienvenida';
import Dashboard from './pages/client/DashboardCliente';
import SocioPage from './pages/client/SocioPage';
import CheckoutPage from './pages/client/CheckoutPage';
import TicketPage from './pages/client/TicketPage';
import App from './App';

const RouterApp = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/planes" element={<Planes />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/socio" element={<SocioPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/ticket" element={<TicketPage />} />
      {/* Ruta para la página original con todos los componentes */}
      <Route path="/erp" element={<App />} />
    </Routes>
  );
};

export default RouterApp;
