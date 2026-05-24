# FitGym - Progress Tracking

This file records implemented functionalities and pending tasks.

## ✅ Implemented
- **Authentication**:
    - [x] User registration.
    - [x] Login with JWT.
    - [x] Email verification.
    - [x] Password recovery.
    - [x] AuthContext for global session management.
    - [x] Role-based protected routes.
- **API Services**:
    - [x] AuthService.
    - [x] UserService.
    - [x] SocioService.
    - [x] `api.config.ts` for centralized request handling.
- **Architecture and Documentation**:
    - [x] Folder restructuring (`common`, `layout`).
    - [x] TypeScript standardization (.tsx) and removal of `@ts-ignore`.
    - [x] Import Alias configuration.
    - [x] `API.md` (Endpoint documentation).
    - [x] `CONTEXT.md` (Project map).
    - [x] `GEMINI.md` (AI instructions).
    - [x] Refactored `AltaUsuario.tsx` into a clean component with a dedicated custom hook (`useAltaUsuario.ts`) and fixed image upload logic.
- **Main Views & ERP Modules**:
    - [x] ERP Dashboard (Basic layout).
    - [x] Member Management (CRUD integrated with SocioService).
    - [x] Landing Page and Plans.
    - [x] Finance Module (Caja, Estado de Resultados, Impuestos, Nómina integration).
    - [x] Inventory Module (Equipos, Suplementos, Mantenimiento, Proveedores).
    - [x] HR Module (RRHHPage payroll file generation & contract roles).
    - [x] Reservations Module (HorarioSemanal, class lists, slot booking).
    - [x] Marketing Module (LeadsPage, CampanasPage, PromocionesPage, SegmentacionPage).

## 🏗️ In Progress
- [x] Merged feature branches (`creacionLoginAuth` in backend, `RamaRodrigo` in frontend) into `develop` with compile verification.

## 📋 Pending Implementation
- **Plans Module**:
    - [ ] `GET /planes` endpoint in backend and integrate in frontend.
    - [ ] Plan purchasing from client view.
- **Payments Module**:
    - [ ] Real Checkout integration (Stripe or similar).
    - [ ] Generation of real digital tickets/invoices.
- **Dynamic ERP Dashboard**:
    - [ ] Charts connected to real backend data.
    - [ ] Exportable reports.
- **UX/UI Improvements**:
    - [ ] Implement loading skeletons.
    - [ ] More visual error handling (Toasts).
- **Optimization**:
    - [ ] Evaluation of TanStack Query for cache management.
    - [ ] Evaluation of Zustand for complex states if necessary.
