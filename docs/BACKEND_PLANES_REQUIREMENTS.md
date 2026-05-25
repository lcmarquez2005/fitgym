# Backend Requirements: Módulo de Planes

Este documento detalla los requerimientos para el desarrollo del backend (Spring Boot) relacionados con el módulo de Planes y Membresías.

## Entidad: `Plan`

La entidad `Plan` (o `MembershipPlan`) debe contener la siguiente estructura base:

```json
{
  "id": 1,
  "nombre": "Plan Básico",
  "descripcion": "Acceso limitado a las instalaciones",
  "precio": 29.99,
  "duracionDias": 30,
  "caracteristicas": [
    "Acceso área de pesas",
    "Horario de 6am a 2pm"
  ],
  "activo": true
}
```

### Notas sobre los campos:
*   `precio`: Debe ser de tipo `BigDecimal` o `Double`.
*   `duracionDias`: Entero que indica la validez del plan (ej. 30 para mensual, 365 para anual).
*   `caracteristicas`: Debe ser un array de strings.
*   `activo`: Booleano para soft-delete o para pausar la venta de un plan sin borrar el historial.

---

## Endpoints Requeridos

### 1. Obtener todos los planes activos (PÚBLICO)
*   **Ruta**: `GET /api/planes`
*   **Seguridad**: **PÚBLICO** (No requiere token JWT). Esto es crucial para que la Landing Page pueda mostrar los planes a usuarios no registrados.
*   **Parámetros**: Opcional `?incluirInactivos=false`
*   **Respuesta**: `200 OK` con un array de objetos `Plan`.

### 2. Obtener un plan por ID (PÚBLICO)
*   **Ruta**: `GET /api/planes/{id}`
*   **Seguridad**: **PÚBLICO**
*   **Respuesta**: `200 OK` con el objeto `Plan` o `404 Not Found`.

### 3. Crear un nuevo plan (PRIVADO - ADMIN)
*   **Ruta**: `POST /api/planes`
*   **Seguridad**: Requiere JWT y rol `ADMIN`.
*   **Body**: Objeto `Plan` (sin ID).
*   **Respuesta**: `201 Created` con el plan creado.

### 4. Actualizar un plan (PRIVADO - ADMIN)
*   **Ruta**: `PUT /api/planes/{id}`
*   **Seguridad**: Requiere JWT y rol `ADMIN`.
*   **Body**: Objeto `Plan` modificado.
*   **Respuesta**: `200 OK` con el plan actualizado.

### 5. Eliminar / Desactivar un plan (PRIVADO - ADMIN)
*   **Ruta**: `DELETE /api/planes/{id}`
*   **Seguridad**: Requiere JWT y rol `ADMIN`.
*   **Lógica sugerida**: Se recomienda hacer un *Soft Delete* (cambiar `activo = false`) en lugar de borrar el registro de la base de datos.
*   **Respuesta**: `200 OK` o `204 No Content`.

---

## Configuración de Seguridad (SecurityConfig)

Asegurarse de permitir acceso público a `/api/planes`:

```java
http.authorizeHttpRequests(auth -> auth
    .requestMatchers(HttpMethod.GET, "/api/planes/**").permitAll()
    .anyRequest().authenticated()
);
```
