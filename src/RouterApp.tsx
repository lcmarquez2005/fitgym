import { Routes, Route } from 'react-router-dom';
// @ts-ignore
import LandingPage from './pages/client/Planes.jsx';
// @ts-ignore
import Dashboard from './pages/client/DashboardCliente.jsx';
// @ts-ignore
import SocioPage from './pages/client/SocioPage.jsx';
// @ts-ignore
import CheckoutPage from './pages/client/CheckoutPage.jsx';
// @ts-ignore
import TicketPage from './pages/client/TicketPage.jsx';
import App from './App';

const RouterApp = () => {
  return (
    <Routes>
      <Route path="/plans" element={<LandingPage />} />
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
