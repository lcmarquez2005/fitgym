# API Documentation - FitGym

This document centralizes endpoint information, integration status, and security policies.

## Security Configuration (Backend)

The backend uses **Spring Boot Security** with JWT. All requests must include the authorization token in the header, except for the following public routes:

- `POST /api/auth/**` (Registration, Login, Verification, Password Reset)
- `POST /api/users/upload-photo`
- `GET /uploads/**` (Static resources/images)

### Frontend Implementation
For all **private** routes, it is mandatory to use the `getAuthHeaders()` function defined in `src/services/auth.headers.ts`. This function retrieves the token from `localStorage` and adds the header `Authorization: Bearer <token>`.

---

## Endpoint Catalog

### 1. Authentication (`/api/auth`) - **PUBLIC**
Status: **Integrated** in `AuthService`.

- `POST /auth/register` - New user registration.
- `GET /auth/verify-email?token={token}` - Account verification via email.
- `POST /auth/login` - Login (Returns JWT token).
- `POST /auth/forgot-password` - Request password recovery.
- `POST /auth/reset-password` - Set new password with token.
- `PUT /auth/change-password` - Change password (Requires Login).
- `DELETE /auth/delete-account` - Delete account from system (Requires Login).

### 2. Users (`/api/users`) - **PRIVATE**
Status: **Integrated** in `UserService`.

- `GET /users` - Get list of all users.
- `GET /users/search?q={query}` - Filtered user search.
- `POST /users` - Create a new admin/employee user.
- `POST /users/upload-photo` - (**PUBLIC**) Upload profile photo.

### 3. Members/Socios (`/api/socios`) - **PRIVATE**
Status: **Integrated** in `SocioService`.

- `GET /socios/buscar?q={query}` - Search members by name or ID.
- `POST /socios` - Register a new member.
- `PUT /socios/{id}` - Update existing member data.
- `DELETE /socios/{id}` - Terminate member subscription.

### 4. Plans and Memberships (`/api/planes`) - **PRIVATE**
Status: **Pending Creation**.

- `GET /planes` - Get catalog of available plans (Regular, Super, Mega).
- `GET /planes/{id}` - Details of a specific plan.

### 5. Payments and Checkout (`/api/pagos`) - **PRIVATE**
Status: **Pending Creation**.

- `POST /pagos/checkout` - Process membership payment (Stripe/PayPal or manual).
- `GET /pagos/historial` - Consult user payment history.

### 6. Dashboard and Statistics (`/api/dashboard`) - **PRIVATE**
Status: **Pending Creation**.

- `GET /dashboard/cliente/resumen` - Membership summary, days remaining, etc.
- `GET /erp/dashboard/resumen` - Global statistics for administration.
- `GET /erp/dashboard/reportes` - Detailed reports in JSON/PDF format.
