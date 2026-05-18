# Gemini AI - Instrucciones de Comportamiento

Este archivo sirve como guía para la IA (Gemini CLI) al interactuar con el código de FitGym.

## Reglas de Oro
- **Consultar Contexto**: Antes de realizar cualquier cambio estructural, leer `CONTEXT.md`.
- **Validar Endpoints**: Antes de implementar una nueva funcionalidad que requiera datos, consultar `API.md`.
- **Seguimiento**: Actualizar `PROGRESS.md` después de cada hito importante completado o feature agregada.

## Flujo de Trabajo para la IA
1. **Investigación**: Analizar archivos existentes relacionados con la tarea.
2. **Estrategia**: Proponer el plan al usuario (Modo Plan si es complejo).
3. **Ejecución**: Aplicar cambios quirúrgicos siguiendo las convenciones de `CONTEXT.md`.
4. **Validación**: Correr `npx tsc --noEmit` para asegurar que no se introdujeron errores de tipos.

## Restricciones Técnicas
- **Extensiones**: Solo crear archivos `.tsx` para componentes.
- **Imports**: Usar alias (`@common`, `@layout`, `@pages`, `@services`) siempre que sea posible.
- **Seguridad**: Asegurarse de que las llamadas a endpoints privados usen `getAuthHeaders()`.
- **Librerías**: No instalar nuevas librerías (como TanStack Query o Zustand) sin aprobación explícita, tal como se indica en `CONTEXT.md`.
