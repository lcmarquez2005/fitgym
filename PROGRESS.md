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
- **Infrastructure**:
    - [x] Vercel Proxy (rewrites) to bypass mixed content (HTTP/HTTPS) issues.
    - [x] Relative API paths in frontend for cross-environment compatibility.
- **Main Views (Structure)**:
    - [x] ERP Dashboard (Basic layout).
    - [x] Member Management (CRUD integrated with SocioService).
    - [x] Landing Page and Plans.
    - [x] **Edit User**: Modal for editing user profiles directly from the dashboard.
    - [x] **Access Control (Kiosk Mode)**: Public view for entry validation via Control Number or Fingerprint.
- **Payments and Memberships**:
    - [x] `PagoService` for processing payments.
    - [x] `ProcesarPagoModal` for manual membership renewals and payments.
    - [x] Integration of payment flow into User and Socio details.

## 🏗️ In Progress
- [ ] Refinement of context documentation.

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
- **Optimization**:
    - [ ] Evaluation of TanStack Query for cache management.
    - [ ] Evaluation of Zustand for complex states if necessary.
