// src/RouterApp.tsx
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './guard/ProtectedRoute';
import { Toaster } from 'sonner';

// =============================================
// PÁGINAS PÚBLICAS (Landing Page)
// =============================================
import LandingPage from '@pages/client/Bienvenida';
import CheckoutPage from '@pages/client/CheckoutPage/index';
import TicketPage from '@pages/client/TicketPage';

// =============================================
// PÁGINAS ERP (Protegidas)
// =============================================
import App from './App';
import SocioPage from '@pages/client/SocioPage/index';
import DashboardCliente from '@pages/client/DashboardCliente/index';
import FinanzasPage from './pages/erp/finanzas/FinanzasPage';
import InventarioPage from './pages/erp/inventario/InventarioPage';
import RRHHPage from './pages/erp/rrhh/RRHHPage';
import ReservasPage from './pages/erp/reservas/ReservasPage';

// =============================================
// PÁGINAS DE AUTENTICACIÓN
// =============================================
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPAge';
import ControlAcceso from '@pages/erp/ControlAcceso';
import MarketingPage from '@pages/erp/marketing/MarketingPage';
import PlanesCRUD from '@pages/erp/planes/PlanesCRUD';

const RouterApp = () => {
    return (
        <AuthProvider>
            <Toaster richColors position="top-right" />
            <Routes>
                {/* ============================================= */}
                {/* RUTAS PÚBLICAS - LANDING PAGE                 */}
                {/* ============================================= */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/ticket" element={<TicketPage />} />
                <Route path="/control-acceso" element={<ControlAcceso />} />

                {/* ============================================= */}
                {/* RUTAS DE AUTENTICACIÓN                        */}
                {/* ============================================= */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />

                {/* ============================================= */}
                {/* RUTAS PROTEGIDAS - ERP                       */}
                {/* Solo accesibles con token JWT válido          */}
                {/* ============================================= */}
                <Route
                    path="/erp"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'COACH']}>
                            <App />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/socio"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'COACH']}>
                            <SocioPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/erp/finanzas"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <FinanzasPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/erp/inventario"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'COACH']}>
                            <InventarioPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/erp/rrhh"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <RRHHPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/erp/reservas"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'COACH']}>
                            <ReservasPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/erp/marketing"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <MarketingPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/erp/planes"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <PlanesCRUD />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['USER', 'SOCIO']}>
                            <DashboardCliente />
                        </ProtectedRoute>
                    }
                />
                
                {/* Ruta 404 - Página no encontrada */}
                <Route
                    path="*"
                    element={
                        <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center">
                                <h1 className="text-6xl font-bold text-gray-300">404</h1>
                                <p className="text-xl text-gray-500 mt-4">Página no encontrada</p>
                            </div>
                        </div>
                    }
                />
            </Routes>
        </AuthProvider>
    );
};

export default RouterApp;
