# FitGym Project - Architectural & Functional Context

This document describes the structure, technologies, conventions, and functional modules of the FitGym project to maintain development consistency.

---

## 1. Core Technologies
- **Frontend**: React 19 (Vite), TypeScript.
- **Styling**: Tailwind CSS 4.
- **Icons**: Lucide React.
- **Notifications**: Sonner (Global toasts).
- **Routing**: React Router DOM 7.
- **Backend (Reference)**: Spring Boot with JWT Security.

---

## 2. Directory Structure
The architecture follows a component-based approach organized by purpose, utilizing aliases for clean imports.

- `src/assets/`: Static resources (images, logos) imported in code.
- `src/components/`:
    - `common/`: Low-level reusable components (Buttons, Inputs, Generic Cards).
    - `layout/`: Global structure components (Navbar, Sidebar, Footer, Header).
    - `client/`: Specific components for the client-side view.
- `src/context/`: React Contexts (e.g., AuthContext for session management).
- `src/guard/`: Route guards (ProtectedRoute) based on roles.
- `src/hooks/`: Custom hooks for reusable logic.
- `src/pages/`: Main view containers, organized by modules (auth, client, erp).
- `src/services/`: Network abstraction layer for backend requests.
- `src/services/api.config.ts`: Base fetch configuration and error handling.

---

## 3. Import Aliases (Vite & TS)
- `@/*`: `src/*`
- `@img/*`: `public/images/*`
- `@assets/*`: `src/assets/*`
- `@components/*`: `src/components/*`
- `@common/*`: `src/components/common/*`
- `@layout/*`: `src/components/layout/*`
- `@pages/*`: `src/pages/*`
- `@services/*`: `src/services/*`
- `@context/*`: `src/context/*`
- `@hooks/*`: `src/hooks/*`

---

## 4. Development Conventions
1. **Strict Typing**: Avoid using `any` and `@ts-ignore`. All components must be `.tsx`.
2. **Requests**: Do not use `fetch` directly in components. Use the services defined in `src/services/`.
3. **Security**: For private endpoints, use `getAuthHeaders()` from `@services/auth.headers.ts`.
4. **Notifications**: Use `toast` from `sonner` for all success/error feedback. Avoid using local state for alerts.
5. **State Management**: Currently using `Context API` for global state and local `useState`. TanStack Query or Zustand have not been implemented yet.
6. **Package Manager**: Use ONLY `pnpm`. `npm` is strictly forbidden.

---

## 5. Functional ERP Modules (Frontend)

### Finanzas (`src/pages/erp/finanzas/`)
* **FinanzasPage.tsx**: Layout with navigation between tabs.
* **DashboardFinanzas.tsx**: Daily KPIs, notifications, and transactions list.
* **CajaPage.tsx**: Open/close cash register, record transactions.
* **EstadoResultadosPage.tsx**: Monthly profit and loss statements.
* **ImpuestosPage.tsx**: Fiscal periods, IVA, ISR, DIOT calculations.
* **NominaPage.tsx**: Fortnightly payroll processing.
* **Service (`finance.service.ts`)**: API handler for all finance requests.

### Inventario (`src/pages/erp/inventario/`)
* **EquiposPage.tsx** & **SuplementosPage.tsx**: Management of gym machines, equipment, and shop supplements.
* **MantenimientoPage.tsx**: Log and schedule maintenance tasks.
* **ProveedoresPage.tsx**: Directory and contact info for wholesalers.

### RRHH (`src/pages/erp/rrhh/`)
* **RRHHPage.tsx**: Employee contracts, scheduling, and shifts management.

### Reservas (`src/pages/erp/reservas/`)
* **HorarioSemanal.tsx** & **CatalogosReservas.tsx**: Schedule classes, salons, waitlists, and manage member bookings.

### Marketing (`src/pages/erp/marketing/`)
* **CampanasPage.tsx**, **LeadsPage.tsx**, **PromocionesPage.tsx**, **SegmentacionPage.tsx**: Campaign builders, discount codes, customer segmentation, and lead trackers.

---

## 6. Local Development Requirements
1. Node.js v20+.
2. Local `.env` file containing: `VITE_API_URL=http://localhost:8080/api`
3. Execute `pnpm install` then `pnpm run dev`.
