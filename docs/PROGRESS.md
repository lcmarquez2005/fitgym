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
- **Main Views & ERP Modules**:
    - [x] ERP Dashboard (Basic layout).
    - [x] Member Management (CRUD integrated with SocioService).
    - [x] Landing Page and Plans.
    - [x] Finance Module (Caja, Estado de Resultados, Impuestos, Nómina integration).
    - [x] Inventory Module (Equipos, Suplementos, Mantenimiento, Proveedores).
    - [x] HR Module (RRHHPage payroll file generation & contract roles).
    - [x] Reservations Module (HorarioSemanal, class lists, slot booking).
    - [x] Marketing Module (LeadsPage, CampanasPage, PromocionesPage, SegmentacionPage).
    - [x] **Edit User**: Modal for editing user profiles directly from the dashboard.
    - [x] **Access Control (Kiosk Mode)**: Public view for entry validation via Control Number or Fingerprint.
- **Payments and Memberships**:
    - [x] `PagoService` for processing payments.
    - [x] `ProcesarPagoModal` for manual membership renewals and payments.
    - [x] Integration of payment flow into User and Socio details (ERP).
    - [x] **Public Web Purchase Flow**: Connected `Planes.tsx`, `CheckoutPage` (auto-promotion/payment), and dynamic `TicketPage.tsx` for client-side subscription purchases.
    - [x] Aligned ID handling to resolve user/socio ID mismatch in payments.
- **Plans Module**:
    - [x] `GET /planes` endpoint in backend integrated with authorization headers in frontend.
    - [x] Dynamic pricing plan cards populated from database.
- **UX/UI & Polishing**:
    - [x] Replaced all plain WhatsApp-like emojis in ERP modules, tab titles, status cards, and action modals with professional vector icons (`lucide-react`) and clean CSS dot indicators.
    - [x] Fixed React Rules of Hooks violations in `Sidebar` component.
    - [x] Fixed copy-paste route import error for `/ticket`.
    - [x] **Premium Landing Page & Checkout Redesign**: Fully redesigned landing page (`Bienvenida.tsx`), credit card checkout mockup, custom authentication banners for purchase flow context, and digital invoice receipt with print functionality.
    - [x] Consolidated pricing grid directly on the landing page and deleted the redundant `/planes` view.
    - [x] Implemented smooth CSS scroll snapping for all landing page sections.
    - [x] Reduced dimensions and spacing of pricing cards to accommodate multiple membership items horizontally.
    - [x] Removed hard dark borders and enhanced glassmorphism/backdrop-blur elements with colored background spheres.

## 🏗️ In Progress
- [ ] Real Checkout payment gateway integration (Stripe or similar).

## 📋 Pending Implementation
- **Payments Module**:
    - [ ] Real Checkout integration (Stripe or similar) webhook handlers.
    - [ ] Generation of real digital tickets/invoices.
- **Dynamic ERP Dashboard**:
    - [ ] Charts connected to real backend data.
    - [ ] Exportable reports.
- **UX/UI Improvements**:
    - [ ] Implement loading skeletons.
- **Optimization**:
    - [ ] Evaluation of TanStack Query for cache management.
    - [ ] Evaluation of Zustand for complex states if necessary.
