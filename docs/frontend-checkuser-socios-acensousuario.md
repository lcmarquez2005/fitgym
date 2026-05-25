# Contexto para el Frontend: Flujo de Pagos y Socios

Este documento detalla los endpoints y la lógica de negocio necesaria para desarrollar el módulo de socios y pagos en el frontend.

## 🔑 Autenticación
Todos los endpoints (excepto `check-user`) requieren el token JWT en la cabecera:
`Authorization: Bearer <TOKEN>`

---

## 1. Validación de Entrada (Kiosco/Torniquete)
**Endpoint:** `GET /api/socios/check-user/{identifier}`
**Descripción:** Valida si un socio tiene permiso de entrar según su estatus y vigencia.

*   **Parámetro `identifier`**: Puede ser el `noControl` o la `huellaDigital`.
*   **Seguridad**: Endpoint **PÚBLICO** (No requiere token).
*   **Lógica de Negocio**:
    *   Si el estatus es diferente a `ACTIVO`, el acceso es denegado.
    *   Si la `fechaFin` es anterior a hoy, el acceso es denegado.
*   **Respuesta Exitosa (`success: true`)**:
    ```json
    {
      "message": "¡Acceso permitido! Bienvenido Juan",
      "success": true,
      "data": { ...SocioResponse... }
    }
    ```

---

## 2. Registro y "Ascenso" de Socio
**Endpoint:** `POST /api/socios`
**Descripción:** Crea un nuevo socio o convierte un usuario existente en socio.

*   **Payload (`SocioRequest`)**:
    ```json
    {
      "name": "Luis",
      "lastName": "Marquez",
      "email": "test@test.com",
      "noControl": "23200286",
      "tipoMembresia": "MENSUAL",
      "costoMensual": "500.00",
      "fechaInicio": "2026-05-24",
      "fechaFin": "2026-06-24",
      "estatus": "ACTIVO"
    }
    ```
*   **Lógica Especial**: 
    *   Si el `email` ya existe como un `Usuario` en el sistema, el backend **lo vincula automáticamente** a este nuevo perfil de socio.
    *   Si el `noControl` ya está en uso por otro socio, devolverá un error 400.

---

## 3. Procesar Pago y Renovación Automática
**Endpoint:** `POST /api/pagos/procesar`
**Descripción:** Registra un pago en el historial y extiende la vigencia del socio.

*   **Payload (`PagoRequest`)**:
    ```json
    {
      "idSocio": 1,
      "monto": 500.00,
      "mesesPagados": 1,
      "metodoPago": "EFECTIVO",
      "plan": "Mensualidad Normal"
    }
    ```
*   **Lógica de Negocio (Renovación)**:
    *   **Si el socio está vencido**: La nueva `fechaFin` será `Hoy + mesesPagados`.
    *   **Si el socio sigue vigente**: Se le suman los meses a su `fechaFin` actual (no pierde los días que ya tenía pagados).
    *   El estatus del socio cambia automáticamente a `ACTIVO`.
*   **Respuesta**:
    ```json
    {
      "message": "Pago procesado exitosamente. Membresía renovada hasta 2026-07-24",
      "success": true,
      "data": {
        "pagoId": 5,
        "socio": "Juan Perez",
        "nuevaFechaFin": "2026-07-24",
        "montoPagado": 500.00
      }
    }
    ```

---

## 4. Estructuras de Datos Comunes

### ApiResponse<T>
Todas las respuestas siguen este formato:
- `message` (String): Descripción del resultado.
- `success` (Boolean): Indica si la operación fue exitosa.
- `data` (T): Los datos solicitados (puede ser null).

### SocioResponse
Contiene datos del Usuario vinculado y del Socio:
- `id` (Long): ID del socio.
- `usuarioId` (Long): ID del usuario vinculado.
- `nombreCompleto` (String).
- `email` (String).
- `noControl` (String).
- `fechaFin` (String - YYYY-MM-DD).
- `estatus` (String: "ACTIVO", "INACTIVO", etc).

