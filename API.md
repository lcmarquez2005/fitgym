# API Documentation - FitGym

Este documento centraliza la información de los endpoints de la API, su estado de integración en el frontend y las políticas de seguridad.

## Configuración de Seguridad (Backend)

El backend utiliza **Spring Boot Security** con JWT. Todas las peticiones deben incluir el token de autorización en el header, a excepción de las siguientes rutas públicas:

- `POST /api/auth/**` (Registro, Login, Verificación, Password Reset)
- `POST /api/users/upload-photo`
- `GET /uploads/**` (Recursos estáticos/imágenes)

### Implementación en Frontend
Para todas las rutas **privadas**, es obligatorio utilizar la función `getAuthHeaders()` definida en `src/services/auth.headers.ts`. Esta función recupera el token del `localStorage` y lo añade al header `Authorization: Bearer <token>`.

---

## Catálogo de Endpoints

### 1. Autenticación (`/api/auth`) - **PÚBLICO**
Estado: **Integrado** en `AuthService`.

- `POST /auth/register` - Registro de nuevo usuario.
- `GET /auth/verify-email?token={token}` - Verificación de cuenta vía email.
- `POST /auth/login` - Inicio de sesión (Retorna el token JWT).
- `POST /auth/forgot-password` - Solicitar recuperación de contraseña.
- `POST /auth/reset-password` - Establecer nueva contraseña con token.
- `PUT /auth/change-password` - Cambiar contraseña (Requiere Login).
- `DELETE /auth/delete-account` - Eliminar cuenta del sistema (Requiere Login).

### 2. Usuarios (`/api/users`) - **PRIVADO**
Estado: **Integrado** en `UserService`.

- `GET /users` - Obtener lista de todos los usuarios.
- `GET /users/search?q={query}` - Búsqueda filtrada de usuarios.
- `POST /users` - Crear un nuevo usuario administrador/empleado.
- `POST /users/upload-photo` - (**PÚBLICO**) Subir foto de perfil.

### 3. Socios (`/api/socios`) - **PRIVADO**
Estado: **Refactorizando** (Migrando de peticiones directas en `SocioPage` a `SocioService`).

- `GET /socios/buscar?q={query}` - Búsqueda de socios por nombre o ID.
- `POST /socios` - Registrar un nuevo socio.
- `PUT /socios/{id}` - Actualizar datos de un socio existente.
- `DELETE /socios/{id}` - Dar de baja a un socio.

### 4. Planes y Membresías (`/api/planes`) - **PRIVADO**
Estado: **Pendiente de Creación**.

- `GET /planes` - Obtener catálogo de planes (Regular, Super, Mega).
- `GET /planes/{id}` - Detalles de un plan específico.

### 5. Pagos y Checkout (`/api/pagos`) - **PRIVADO**
Estado: **Pendiente de Creación**.

- `POST /pagos/checkout` - Procesar pago de membresía (Stripe/PayPal o manual).
- `GET /pagos/historial` - Consultar historial de pagos del usuario.

### 6. Dashboard y Estadísticas (`/api/dashboard`) - **PRIVADO**
Estado: **Pendiente de Creación**.

- `GET /dashboard/cliente/resumen` - Resumen de membresía, días restantes, etc.
- `GET /erp/dashboard/resumen` - Estadísticas globales para administración.
- `GET /erp/dashboard/reportes` - Reportes detallados en formato JSON/PDF.
