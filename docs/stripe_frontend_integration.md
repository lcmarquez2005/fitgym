# 🎨 Guía Frontend — Pasarela de Pagos Stripe + Google Pay

**Para**: Desarrollador del frontend (Landing Page)  
**Feature**: Registro + pago con Google Pay desde la landing  
**Backend completado**: 2026-05-26

---

## ¿Qué cambió en el Backend?

Se agregaron **3 endpoints completamente públicos** (sin JWT) bajo `/api/landing/`:

| Método | Endpoint | Para qué |
|---|---|---|
| `POST` | `/api/landing/iniciar-registro` | Enviar formulario del usuario → obtener URL de pago + sessionId |
| `POST` | `/api/landing/webhook/stripe` | Solo Stripe lo llama — NO implementar en el frontend |
| `GET` | `/api/landing/verificar-pago/{sessionId}` | Polling para saber si el pago fue confirmado |

---

## Flujo de Pantallas (UX Recomendado)

```
[Planes] → [Formulario Datos] → [Pantalla QR / Cargando] → [Éxito / Error]
```

### Pantalla 1 — Selección de Plan
- `GET /api/planes` (ya existe, no cambió) — Mostrar cards con planes activos.
- Al hacer clic en "Elegir plan" → guardar `planId` y navegar al formulario.

### Pantalla 2 — Formulario de Datos
```
Nombre* | Apellido* | Email* | Teléfono
[ Continuar y pagar con Google Pay → ]
```
Al enviar: `POST /api/landing/iniciar-registro`

### Pantalla 3 — QR + Estado
- Mostrar QR generado con la URL `data.qrData` del response.
- En paralelo, iniciar polling a `GET /api/landing/verificar-pago/{sessionId}`.
- Si el usuario está en desktop, también mostrar botón "Pagar en este dispositivo" (abre `data.checkoutUrl` en nueva pestaña).

### Pantalla 4 — Éxito
- Se activa cuando el polling devuelve `data.estatus === "PAGADO"`.
- Mostrar: "¡Tu membresía está activa! Revisa tu email para tus credenciales."

---

## Implementación: Paso 1 — Iniciar Registro

```javascript
// POST /api/landing/iniciar-registro
async function iniciarRegistro(formData) {
  const response = await fetch('https://tu-api.com/api/landing/iniciar-registro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      planId: formData.planId    // número, ej: 1
    })
  });

  const data = await response.json();

  if (data.success) {
    // data.data contiene: { checkoutUrl, sessionId, qrData, planNombre, monto }
    return data.data;
  } else {
    throw new Error(data.message);
  }
}
```

**Ejemplo de response exitoso:**
```json
{
  "success": true,
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_abc123",
    "sessionId": "cs_test_abc123",
    "qrData": "https://checkout.stripe.com/c/pay/cs_test_abc123",
    "planNombre": "Membresía Mensual",
    "monto": "$500.00 MXN"
  }
}
```

---

## Implementación: Paso 2 — Generar el QR

Usar la librería `qrcode` (npm) o `qrcode.js` (CDN):

```bash
npm install qrcode
```

```javascript
import QRCode from 'qrcode';

async function generarQR(url, canvasElement) {
  await QRCode.toCanvas(canvasElement, url, {
    width: 280,
    margin: 2,
    color: {
      dark: '#1a1a1a',
      light: '#ffffff'
    }
  });
}

// Uso:
const checkoutData = await iniciarRegistro(formData);
const canvas = document.getElementById('qr-canvas');
await generarQR(checkoutData.qrData, canvas);
```

**Alternativa sin librería (img tag con API de terceros):**
```javascript
// Servicio de QR gratuito — solo para desarrollo
const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(checkoutData.qrData)}`;
document.getElementById('qr-img').src = qrImageUrl;
```

---

## Implementación: Paso 3 — Polling del Estado

```javascript
async function esperarPago(sessionId, onPagado, onError) {
  const maxIntentos = 60;  // 60 × 3s = 3 minutos máximo
  let intentos = 0;

  const interval = setInterval(async () => {
    intentos++;
    if (intentos > maxIntentos) {
      clearInterval(interval);
      onError('Tiempo de espera agotado. ¿Completaste el pago? Revisa tu email.');
      return;
    }

    try {
      const response = await fetch(
        `https://tu-api.com/api/landing/verificar-pago/${sessionId}`
      );
      const data = await response.json();

      if (data.data?.estatus === 'PAGADO') {
        clearInterval(interval);
        onPagado(data.data);  // { socioId, fechaFin, email, planNombre }
      }

      if (data.data?.estatus === 'EXPIRADO') {
        clearInterval(interval);
        onError('La sesión de pago expiró. Por favor intenta de nuevo.');
      }
    } catch (err) {
      console.error('Error en polling:', err);
    }
  }, 3000);  // Cada 3 segundos

  return () => clearInterval(interval); // Función para limpiar
}
```

---

## Implementación: Componente Completo (Vue/React/Vanilla)

```javascript
// Flujo completo integrado
async function flujoCompleto(formData) {
  // 1. Mostrar loader
  mostrarEstado('cargando', 'Preparando tu sesión de pago...');

  // 2. Iniciar registro → obtener QR
  let checkoutData;
  try {
    checkoutData = await iniciarRegistro(formData);
  } catch (error) {
    mostrarEstado('error', error.message);
    return;
  }

  // 3. Mostrar pantalla con QR
  mostrarEstado('qr', {
    qrUrl: checkoutData.qrData,
    checkoutUrl: checkoutData.checkoutUrl,
    planNombre: checkoutData.planNombre,
    monto: checkoutData.monto
  });

  // 4. Iniciar polling
  const detenerPolling = await esperarPago(
    checkoutData.sessionId,
    (pagoData) => {
      // ✅ Pago exitoso
      mostrarEstado('exito', {
        email: pagoData.email,
        fechaFin: pagoData.fechaFin
      });
    },
    (errorMsg) => {
      // ❌ Error o expirado
      mostrarEstado('error', errorMsg);
    }
  );

  // Limpiar al desmontar el componente
  return detenerPolling;
}
```

---

## Pantalla de QR — Diseño Sugerido

```html
<div class="pago-container">

  <!-- Resumen del plan -->
  <div class="plan-resumen">
    <h2>{{ planNombre }}</h2>
    <p class="precio">{{ monto }}</p>
  </div>

  <!-- QR Code -->
  <div class="qr-wrapper">
    <h3>📱 Escanea con tu celular</h3>
    <canvas id="qr-canvas"></canvas>
    <p class="qr-hint">Abre la cámara o Google Pay y apunta al código</p>
  </div>

  <!-- Separador -->
  <div class="divider">— o —</div>

  <!-- Opción desktop -->
  <a :href="checkoutUrl" target="_blank" class="btn-pagar-desktop">
    💳 Pagar en este dispositivo
  </a>

  <!-- Indicador de espera -->
  <div class="esperando">
    <div class="spinner"></div>
    <p>Esperando confirmación del pago...</p>
  </div>

</div>
```

---

## Pantalla de Éxito — Contenido Sugerido

```html
<div class="exito-container">
  <div class="exito-icon">🎉</div>
  <h1>¡Bienvenido a FitGym!</h1>
  <p>Tu membresía está <strong>activa</strong>.</p>

  <div class="detalles">
    <p>📧 Revisa tu email <strong>{{ email }}</strong></p>
    <p>📅 Válida hasta: <strong>{{ fechaFin }}</strong></p>
    <p>🔑 Te enviamos tus credenciales de acceso</p>
  </div>

  <p class="nota">
    Tu número de control físico será asignado en tu primera visita al gimnasio.
  </p>
</div>
```

---

## Variables de Entorno del Frontend

```env
# Llave PÚBLICA de Stripe (empieza con pk_test_ o pk_live_)
# Esta SÍ puede estar en el frontend
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51TbTIm2L6a64tG3f...

# URL base del backend
VITE_API_URL=http://localhost:8080
```

> ⚠️ La `sk_test_` (llave secreta) **NUNCA** va en el frontend.

---

## Manejo de Errores

| Código HTTP | Causa | Qué mostrar |
|---|---|---|
| `400` | Plan no existe o inactivo | "El plan seleccionado no está disponible" |
| `400` | Email inválido | Validación del formulario |
| `400` | Sesión expirada (polling) | "Sesión expirada. Intenta de nuevo" |
| `200` + `estatus: PENDIENTE` | Normal — seguir polling | Spinner + QR |
| `200` + `estatus: PAGADO` | Pago confirmado | Pantalla de éxito |
| `200` + `estatus: EXPIRADO` | El usuario no pagó | "Sesión expirada. ¿Quieres intentar de nuevo?" |

---

## ¿Qué pasa con los usuarios existentes?

Si el email del formulario ya existe en el sistema:
- El backend lo detecta automáticamente.
- Si tenía rol `USER` → lo asciende a `SOCIO`.
- **No se envía el email de bienvenida** (ya tiene credenciales).
- El frontend puede mostrar el mismo mensaje de éxito.

---

## Páginas a Crear en el Frontend

| Ruta | Descripción |
|---|---|
| `/planes` | Lista de planes (ya existe, revisar si tiene el botón "Registrarse") |
| `/registro` | Formulario de datos personales + selección de plan |
| `/checkout` | Pantalla QR + polling de estado |
| `/registro-exitoso` | Página de éxito (Stripe redirige aquí con `?session_id=cs_test_...`) |

### Nota sobre `/registro-exitoso`
Stripe redirige al usuario aquí después de pagar en la página de Stripe.
La URL llega con `?session_id=cs_test_abc123` — **úsalo para mostrar el resumen**:

```javascript
// En la página /registro-exitoso
const params = new URLSearchParams(window.location.search);
const sessionId = params.get('session_id');

if (sessionId) {
  // Verificar el pago (el webhook ya lo procesó, esto es solo para mostrar datos)
  const res = await fetch(`/api/landing/verificar-pago/${sessionId}`);
  const data = await res.json();
  // Mostrar data.data.email, data.data.planNombre, data.data.fechaFin
}
```
