# Cambios Requeridos en el Backend - Configuración de Seguridad para Planes Públicos

Para permitir que el flujo de planes sea verdaderamente público (permitiendo a visitantes no registrados ver la lista de planes de precios en la landing page sin recibir un error 403 o de CORS), es necesario modificar la configuración de **Spring Security** en el backend.

---

## 1. Ajustes en Spring Security (`SecurityFilterChain`)

Actualmente, el backend requiere token JWT para todas las peticiones a `/api/planes/**`. Se debe configurar el filtro de seguridad para permitir accesos de tipo `GET` sin token de autenticación.

### Cambios sugeridos en la clase de configuración de seguridad (ej. `SecurityConfig.java` / `WebSecurityConfig.java`):

1. **Permitir peticiones GET a `/api/planes` y `/api/planes/{id}` de manera pública**:
   Añade los matchers específicos en la sección de autorización de peticiones HTTP:

```java
.authorizeHttpRequests(auth -> auth
    // ... Otras rutas públicas existentes ...
    .requestMatchers(HttpMethod.GET, "/api/planes/**").permitAll() // Permite consultar planes de forma pública
    .requestMatchers(HttpMethod.POST, "/api/planes/**").hasRole("ADMIN") // Requiere rol ADMIN para crear
    .requestMatchers(HttpMethod.PUT, "/api/planes/**").hasRole("ADMIN")  // Requiere rol ADMIN para editar
    .requestMatchers(HttpMethod.DELETE, "/api/planes/**").hasRole("ADMIN") // Requiere rol ADMIN para eliminar
    .anyRequest().authenticated()
)
```

2. **Habilitar configuración CORS para peticiones públicas**:
   Asegúrate de que la configuración CORS global (`CorsConfiguration` o `@CrossOrigin` a nivel de controlador) permita peticiones de origen cruzado de manera uniforme para el puerto del frontend (`http://localhost:5173` o el host de producción), incluso cuando no se envíe la cabecera `Authorization`.

---

## 2. Impacto en el Frontend

Una vez aplicados estos cambios en el backend, el frontend podrá realizar las llamadas:
- `GET /api/planes`
- `GET /api/planes/{id}`

Estas llamadas funcionarán de forma pública (sin requerir que la cabecera `Authorization` esté presente en `getAuthHeaders()`). Si el usuario aún no ha iniciado sesión, verá los precios correctamente y el flujo de redirección hacia `/register` / `/checkout` al presionar "¡Lo quiero!" será fluido.
