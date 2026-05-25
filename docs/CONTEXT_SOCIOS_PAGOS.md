# Contexto del Proyecto: Flujo de Socios, Usuarios y Pagos de Mensualidades (MVP)

Este documento detalla la arquitectura, roles de usuario, flujo de membresías y la integración financiera en FitGym para mantener la congruencia en el MVP.

---

## 1. Distinción entre Usuarios y Socios

En el sistema existen dos entidades principales y una separación de responsabilidades:

1. **Usuario (`Usuario` / `/api/users`)**:
   - Representa cualquier cuenta con credenciales en la base de datos (JWT).
   - Posee un **Rol** (`rol`) en el sistema:
     - `ADMIN`: Administradores del ERP con acceso total.
     - `COACH`: Entrenadores con acceso a reservas y clases.
     - `USER`: Clientes que se registraron en línea en la landing page pero **no son socios activos del gimnasio todavía** (no tienen membresía activa y su número de control es temporalmente `"PENDIENTE"`).
     - `SOCIO`: Clientes que tienen un perfil de socio activo y una membresía contratada.

2. **Socio (`Socio` / `/api/socios`)**:
   - Representa a un cliente del gimnasio físico con derecho a entrada y membresía activa.
   - Tiene campos específicos: fecha de inicio, fecha de fin, tipo de membresía, costo mensual, historial médico, huella digital y número de control (`noControl`).
   - Todo `Socio` está **vinculado a un único `Usuario`** (relación 1:1 vía `usuarioId` / `email`). Un `Usuario` puede no ser un `Socio`, pero todo `Socio` debe tener una cuenta de `Usuario` correspondiente con el rol `"SOCIO"`.

---

## 2. Flujo de Registro y Ascenso a Socio

Existen dos caminos para que un cliente obtenga una membresía activa del gimnasio:

### A. Registro desde la Web (Cliente Final)
1. **Registro**: El visitante se registra públicamente en `/register`, lo que crea un `Usuario` en el sistema con el rol `"USER"`.
2. **Selección de Plan**: El usuario ve los planes en la página `/planes` y selecciona uno.
3. **Checkout**: 
   - El sistema valida la sesión (redirecciona a `/login` si no está autenticado).
   - En `/checkout`, el usuario ingresa sus datos de pago.
   - Al procesar el pago, el frontend realiza un **Ascenso**: llama a `SocioService.ascenderASocio` (`POST /api/socios`), asociando su email.
   - El backend crea el registro en `socios`, genera su número de control real y actualiza su rol de `Usuario` a `"SOCIO"`.
   - Inmediatamente, se procesa el pago llamando a `PagoService.procesarPago` con el ID de socio obtenido.
4. **Ticket**: Se redirige a `/ticket` mostrando su ticket digital generado dinámicamente.

### B. Registro desde el ERP (Administración)
1. **Registro Directo de Socio**: En la sección de **Socio** (`/socio`), la administración presiona "Nuevo Registro" y llena el formulario (datos personales, médicos y de membresía). Esto llama a `SocioService.crear` (`POST /api/socios`), creando tanto el `Usuario` con rol `"SOCIO"` como el registro de `Socio` en un solo paso.
2. **Conversión/Ascenso**: Si un usuario ya se registró por la web (`rol: "USER"`) pero acude a recepción a pagar, la administración lo selecciona en la lista de usuarios del ERP (`LeftPanel`), edita su perfil y presiona "Procesar Pago". Al confirmar, se le asciende a `"SOCIO"` y se procesa el pago.

---

## 3. Flujo Contable e Integración de Pagos

El procesamiento de un pago de mensualidad (`POST /api/pagos/procesar`) ejecuta la siguiente lógica automática en el backend:

1. **Vigencia de Membresía**:
   - Si el socio ya está vencido: la nueva fecha de fin es `Hoy + mesesPagados`.
   - Si el socio sigue vigente: se añaden los meses a su `fechaFin` actual sin perder los días restantes.
   - El estatus del socio pasa automáticamente a `ACTIVO`.
2. **Registro Contable (Módulo de Finanzas)**:
   - Se crea una transacción de tipo `"INGRESO"` y categoría `"MEMBRESIA"` en `finance_transaccion`.
   - **Corte de Caja**:
     - Si hay un corte de caja abierto (`CorteCaja` estado `ABIERTA`), la transacción se vincula a este corte.
     - Si la caja está cerrada, se registra con `corteCaja = null`, garantizando que los reportes de ingresos sigan reflejando el dinero real.

---

## 4. Endpoints Clave para la Integración

- **Ascenso e Inscripción**: `POST /api/socios` (asocia el email, actualiza el rol a `"SOCIO"`, genera `noControl`).
- **Procesamiento de Pago**: `POST /api/pagos/procesar` (registra la mensualidad y genera la transacción de ingreso).
- **Validación de Acceso**: `GET /api/socios/check-user/{identifier}` (público, valida `noControl` o huella digital para permitir la entrada física si el estatus es `ACTIVO` y no ha vencido).
