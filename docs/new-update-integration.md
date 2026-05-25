# Guía de Integración para el Frontend - Flujo de Socios y Pagos (MVP)

Esta guía documenta los cambios funcionales y las validaciones del backend aplicadas para el flujo de socios y pagos, facilitando la sincronización con el frontend ya desarrollado.

---

## 1. Registro y Ascenso de Socio (`POST /api/socios`)

Este endpoint se utiliza tanto para registrar a un socio desde cero como para convertir un usuario registrado en la app (rol `"USER"`) en un socio activo del gimnasio.

### Cambios Clave y Nueva Lógica de Negocio:
1. **Ascenso Exitoso**: Si el `email` ya existe en el sistema con rol `"USER"` (registro en línea), el backend asocia la cuenta existente al nuevo perfil de socio, **actualiza su rol a `"SOCIO"`** y reemplaza su número de control temporal (`"PENDIENTE"`) por el número de control real asignado por la administración.
2. **Validación de Unicidad de Número de Control (`noControl`)**:
   * Se valida de forma estricta que el `noControl` enviado no esté en uso por otro usuario en la base de datos.
   * Si ya existe un usuario con ese número de control (diferente al usuario asociado a ese email), la petición fallará devolviendo un código `400 Bad Request`.
3. **Respuesta en caso de error**:
   ```json
   {
     "message": "El número de control '23200286' ya está en uso por otro usuario.",
     "success": false,
     "data": null
   }
   ```

---

## 2. Procesar Pago y Renovación (`POST /api/pagos/procesar`)

Este endpoint procesa un pago, extiende la vigencia de la membresía del socio y ahora integra la transacción al libro contable.

### Cambios Clave y Nueva Lógica de Negocio:
1. **Historial y Contabilidad**: Además de insertar el registro detallado en `new_pagos`, ahora se inserta de forma automática una transacción de tipo `"INGRESO"` y categoría `"MEMBRESIA"` en la tabla `finance_transaccion` del módulo de finanzas.
2. **Corte de Caja Flexible**:
   * Si la administración tiene un **corte de caja abierto** (`CorteCaja` ABIERTA), la transacción contable se asocia automáticamente a ese corte de caja.
   * Si la caja está **cerrada** (o es un pago externo), la transacción contable se registra con `corteCaja = null`. Esto asegura que el pago nunca falle por motivos de caja y que los reportes de ingresos mensuales de finanzas sean 100% reales.
3. **Parámetro Opcional `plan`**: Se puede enviar el nombre del plan en el campo `plan` de la solicitud para que quede registrado en la descripción de la transacción financiera.

### Ejemplo de Solicitud (`PagoRequest`):
```json
{
  "idSocio": 1,
  "monto": 500.00,
  "mesesPagados": 1,
  "metodoPago": "EFECTIVO",
  "plan": "Mensualidad Regular"
}
```

---

## 3. Validación en Entrada / Kiosco (`GET /api/socios/check-user/{identifier}`)

Endpoint público que lee el código de control o la huella del cliente al entrar al gimnasio.

### Notas de Integración:
* Gracias a que el registro de socios ahora actualiza de forma correcta el campo `noControl` en la tabla de usuarios cuando se asocian usuarios existentes, el check-in ahora validará de forma correcta a los usuarios ascendidos (anteriormente fallaba porque el número de control se quedaba atascado en `"PENDIENTE"`).
* Si el socio está vencido o inactivo, devolverá `success: false` y denegará el acceso.

---

## 4. Respuestas del Servidor y Manejo de Errores

Recuerda que todas las respuestas del backend implementan la clase `ApiResponse`:
* **Operaciones Exitosas**: Devuelven código `200 OK` con `success: true`.
* **Errores de Validación / Negocio**: Devuelven código `400 Bad Request` con `success: false` y el mensaje de error explicativo en el campo `message`.
