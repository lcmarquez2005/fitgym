import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './guard/ProtectedRoute';


import { Routes, Route } from 'react-router-dom';
// @ts-ignore
import Planes from './pages/client/Planes.jsx';
// @ts-ignore
import LandingPage from './pages/client/Bienvenida.jsx';
// @ts-ignore
import Dashboard from './pages/client/DashboardCliente.jsx';
// @ts-ignore
import SocioPage from './pages/client/SocioPage.jsx';
// @ts-ignore
import CheckoutPage from './pages/client/CheckoutPage.jsx';
// @ts-ignore
import TicketPage from './pages/client/TicketPage.jsx';


// Autenticación
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage'; //


import App from './App';

const RouterApp = () => {
  return (
    <AuthProvider>
      <Routes>

        {/* Rutas PÚBLICAS (Landing Page) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/planes" element={<Planes />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/socio" element={<SocioPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/ticket" element={<TicketPage />} />

        {/* Rutas de AUTENTICACIÓN */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Ruta para la página original con todos los componentes */}
        <Route
          path="/erp"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'COACH']}>
              <App />
            </ProtectedRoute>
          }
        />
        
      </Routes>
    </AuthProvider>
  );
};

export default RouterApp;
