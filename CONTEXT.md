# Proyecto FitGym - Contexto Arquitectónico

Este documento describe la estructura, tecnologías y convenciones del proyecto FitGym para mantener la coherencia en el desarrollo.

## Tecnologías Principales
- **Frontend**: React 19 (Vite), TypeScript.
- **Estilos**: Tailwind CSS 4.
- **Iconos**: Lucide React.
- **Routing**: React Router DOM 7.
- **Backend (Referencia)**: Spring Boot con Seguridad JWT.

## Estructura de Directorios
La arquitectura sigue un enfoque basado en componentes organizados por propósito y alias para importaciones limpias.

- `src/assets/`: Recursos estáticos (imágenes, logos) importados en el código.
- `src/components/`:
    - `common/`: Componentes reutilizables de bajo nivel (Botones, Inputs, Cards).
    - `layout/`: Componentes de estructura global (Navbar, Sidebar, Footer, Header).
    - `client/`: Componentes específicos de la vista de cliente.
- `src/context/`: Contextos de React (ej. AuthContext para manejo de sesiones).
- `src/guard/`: Protectores de rutas (ProtectedRoute) basados en roles.
- `src/hooks/`: Custom hooks para lógica reutilizable.
- `src/pages/`: Contenedores de vistas principales, organizados por módulos (auth, client, erp).
- `src/services/`: Capa de abstracción de red para peticiones al backend.
- `src/services/api.config.ts`: Configuración base de fetch y manejo de errores.

## Alias de Importación (Vite & TS)
- `@/*`: `src/*`
- `@img/*`: `public/images/*`
- `@components/*`: `src/components/*`
- `@common/*`: `src/components/common/*`
- `@layout/*`: `src/components/layout/*`
- `@pages/*`: `src/pages/*`
- `@services/*`: `src/services/*`

## Convenciones de Desarrollo
1. **Tipado Estricto**: Evitar el uso de `any` y `@ts-ignore`. Todos los componentes deben ser `.tsx`.
2. **Peticiones**: No usar `fetch` directamente en componentes. Utilizar los servicios definidos en `src/services/`.
3. **Seguridad**: Para endpoints privados, usar `getAuthHeaders()` de `@services/auth.headers.ts`.
4. **Estado**: Por ahora se utiliza `Context API` para el estado global y `useState` local. No se ha implementado TanStack Query ni Zustand aún.
