# Contexto del Proyecto: FitGym Frontend

## 1. Visión General
FitGym Frontend es la aplicación cliente web (SPA) para el sistema FitGym. Sirve a tres módulos funcionales principales:
- **Área de Clientes:** Portal para socios del gimnasio (Landing Page pública).
- **Módulo ERP:** Gestión Administrativa interna (protegida por JWT + roles).
- **Auth:** Portal de Autenticación.

## 2. Stack Tecnológico
- **Librería Principal:** React 19
- **Lenguaje:** TypeScript
- **Empaquetador/Build Tool:** Vite
- **Estilos:** Tailwind CSS v4
- **Enrutamiento:** React Router DOM v7
- **Iconos:** Lucide React

## 3. Arquitectura del Proyecto (Carpetas Principales)
El código fuente principal reside en `src/`:
- **`assets/`**: Imágenes, logos y recursos estáticos.
- **`components/`**: Componentes de UI reutilizables (Botones, Modales, Header, Footer, etc.).
- **`context/`**: Estado global con React Context API (ej. `AuthContext` para sesión JWT).
- **`guard/`**: `ProtectedRoute.tsx` — restringe acceso por roles (`ADMIN`, `COACH`, `USER`).
- **`hooks/`**: Custom Hooks de React para lógica desacoplada.
- **`pages/`**: Vistas agrupadas por dominio:
  - `auth/` → Login, Registro, Recuperación de contraseña, Verificación de email.
  - `client/` → Landing, Planes, Checkout, Ticket, Página de Socio.
  - `erp/` → DashboardERP (raíz del panel administrativo).
    - `erp/finanzas/` → Módulo completo de Finanzas (ver sección 4).
- **`services/`**: Abstracción de llamadas HTTP al Backend.
  - `api.config.ts` → URL base (`http://localhost:8080/api`) y utilidad `handleResponse`.
  - `auth.service.ts` → Login, Register, Forgot Password, etc.
  - `finance.service.ts` → **[NUEVO]** Todas las llamadas al módulo de Finanzas.

## 4. Módulo ERP — Finanzas (Frontend)
Ubicación: `src/pages/erp/finanzas/`

### Páginas creadas
| Archivo | Ruta | Descripción |
|---------|------|-------------|
| `FinanzasPage.tsx` | `/erp/finanzas` | Contenedor/layout con navegación entre sub-secciones |
| `DashboardFinanzas.tsx` | Tab dentro de FinanzasPage | KPIs del día, alertas, últimas transacciones |
| `CajaPage.tsx` | Tab dentro de FinanzasPage | Abrir/cerrar caja, registrar transacciones |
| `EstadoResultadosPage.tsx` | Tab dentro de FinanzasPage | P&L mensual con selector de año/mes |
| `ImpuestosPage.tsx` | Tab dentro de FinanzasPage | Períodos fiscales, IVA, ISR, DIOT |
| `NominaPage.tsx` | Tab dentro de FinanzasPage | Generación de nómina quincenal |

### Service (`finance.service.ts`)
Centraliza todas las llamadas HTTP al backend de finanzas.
Incluye funciones: `getDashboard()`, `getEstadoResultados(anio, mes)`, `abrirCaja()`, `cerrarCaja()`, `getCajaActual()`, `registrarTransaccion()`, `crearPeriodoFiscal()`, `calcularIVA()`, `registrarISR()`, `registrarDIOT()`, `generarNomina()`.

## 5. Enrutamiento
Las rutas se gestionan centralmente en `RouterApp.tsx`.
- `/erp` → `DashboardERP` (panel principal)
- `/erp/finanzas` → `FinanzasPage` (módulo de finanzas, protegido)

## 6. Requisitos para el Entorno de Desarrollo Local
1. Node.js v20+.
2. Archivo `.env` con `VITE_API_URL=http://localhost:8080/api`.
3. `npm install` → `npm run dev`.

## 7. Despliegue
El frontend puede desplegarse en **Netlify** o Vercel. Asegúrate de que el Backend tenga el origen de producción en CORS.
