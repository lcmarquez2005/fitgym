# FitGym Project - Architectural Context

This document describes the structure, technologies, and conventions of the FitGym project to maintain development consistency.

## Core Technologies
- **Frontend**: React 19 (Vite), TypeScript.
- **Styling**: Tailwind CSS 4.
- **Icons**: Lucide React.
- **Notifications**: Sonner (Global toasts).
- **Routing**: React Router DOM 7.
- **Backend (Reference)**: Spring Boot with JWT Security.

## Directory Structure
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

## Import Aliases (Vite & TS)
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

## Development Conventions
1. **Strict Typing**: Avoid using `any` and `@ts-ignore`. All components must be `.tsx`.
2. **Requests**: Do not use `fetch` directly in components. Use the services defined in `src/services/`.
3. **Security**: For private endpoints, use `getAuthHeaders()` from `@services/auth.headers.ts`.
4. **Notifications**: Use `toast` from `sonner` for all success/error feedback. Avoid using local state for alerts.
5. **State Management**: Currently using `Context API` for global state and local `useState`. TanStack Query or Zustand have not been implemented yet.
6. **Package Manager**: Use ONLY `pnpm`. `npm` is strictly forbidden.
