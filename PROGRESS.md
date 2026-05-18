# FitGym - Seguimiento de Progreso

Este archivo registra las funcionalidades implementadas y las tareas pendientes.

## ✅ Implementado
- **Autenticación**:
    - [x] Registro de usuario.
    - [x] Login con JWT.
    - [x] Verificación de email.
    - [x] Recuperación de contraseña.
    - [x] AuthContext para manejo de sesión global.
    - [x] Rutas protegidas por rol.
- **Servicios de API**:
    - [x] AuthService.
    - [x] UserService.
    - [x] SocioService.
    - [x] api.config.ts para manejo centralizado de peticiones.
- **Arquitectura y Documentación**:
    - [x] Reestructuración de carpetas (`common`, `layout`).
    - [x] Estandarización a TypeScript (.tsx) y eliminación de `@ts-ignore`.
    - [x] Configuración de Alias de importación.
    - [x] `API.md` (Documentación de endpoints).
    - [x] `CONTEXT.md` (Mapa del proyecto).
    - [x] `GEMINI.md` (Instrucciones para IA).
- **Vistas Principales (Estructura)**:
    - [x] Dashboard ERP (Layout básico).
    - [x] Gestión de Socios (CRUD integrado con SocioService).
    - [x] Landing Page y Planes.

## 🏗️ En Progreso
- [ ] Refinamiento de la documentación de contexto.

## 📋 Pendiente por Implementar
- **Módulo de Planes**:
    - [ ] Endpoint `GET /planes` en el backend e integrarlo en frontend.
    - [ ] Compra de planes desde la vista de cliente.
- **Módulo de Pagos**:
    - [ ] Integración real de Checkout (Stripe o similar).
    - [ ] Generación de tickets/facturas reales.
- **Dashboard ERP Dinámico**:
    - [ ] Gráficas conectadas a datos reales del backend.
    - [ ] Reportes exportables.
- **Mejoras de UX/UI**:
    - [ ] Implementar esqueletos de carga (Skeletons).
    - [ ] Manejo de errores más visual (Toasts).
- **Optimización**:
    - [ ] Evaluación de TanStack Query para gestión de caché.
    - [ ] Evaluación de Zustand para estados complejos si es necesario.
