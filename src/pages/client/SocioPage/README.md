# Módulo: Gestión de Socios (SocioPage)

Este directorio contiene todos los componentes y la lógica para la página de "Gestión de Socios", una de las vistas principales del ERP.

## Propósito

La `SocioPage` permite al personal del gimnasio realizar las siguientes acciones:
- **Buscar** socios existentes por nombre, ID o correo.
- **Visualizar** la información completa de un socio seleccionado.
- **Registrar** un nuevo socio.
- **Actualizar** la información de un socio existente.
- **Eliminar** (dar de baja) a un socio.

## Diseño y Estructura

La página utiliza un **layout de 2 columnas** para una mejor ergonomía en pantallas de escritorio:
- **Columna Izquierda (Principal):** Ocupa 2/3 del espacio y contiene los componentes de información del socio (`SocioProfileCard`, `SocioMembershipCard`, `SocioMedicalCard`).
- **Columna Derecha (Lateral):** Ocupa 1/3 del espacio y contiene los botones de acción (`SocioActions`). Esta columna es `sticky`, por lo que permanece visible al hacer scroll.

El diseño está implementado enteramente con **Tailwind CSS**, siguiendo las convenciones del proyecto. No se utilizan hojas de estilo CSS externas o CSS-in-JS.

## Estructura de Componentes

- **`index.tsx` (SocioPage):**
  - Es el componente principal que orquesta a todos los demás.
  - Maneja el estado principal de la página: `formData`, `resultados` de búsqueda, `socioSeleccionadoId`, etc.
  - Contiene la lógica para interactuar con `SocioService` (buscar, crear, actualizar, eliminar).
  - Define las clases base de Tailwind para los inputs (`inputClass`) y labels (`labelClass`) que se propagan a los componentes hijos.

- **`SocioSearchBar.tsx`:**
  - Renderiza la barra de búsqueda y la lista de resultados.
  - Recibe y ejecuta las funciones de búsqueda y selección del componente padre.

- **`SocioProfileCard.tsx`, `SocioMembershipCard.tsx`, `SocioMedicalCard.tsx`:**
  - Muestran y permiten editar los datos del socio, segmentados por área (perfil, membresía, médico). Utilizan las clases de Tailwind propagadas desde el padre.

- **`SocioActions.tsx`:**
  - Contiene los botones de acción principales (Guardar, Actualizar, Eliminar, Estado de cuenta).
  - Su visibilidad y estado cambian según si se está creando o editando un socio.

- **`types.ts`:**
  - Define las interfaces de TypeScript (`Socio`, `SocioFormData`) para asegurar la consistencia de los datos en todo el módulo.

## Flujo de Datos

1.  El usuario introduce un término en `SocioSearchBar`.
2.  `SocioPage` ejecuta `buscarSocio()` a través de `SocioService`.
3.  Los resultados se muestran en el dropdown de `SocioSearchBar`.
4.  Al seleccionar un socio, `SocioPage` llama a `seleccionarSocio()`.
5.  `seleccionarSocio()` actualiza el `formData` con los datos del socio y bloquea los campos (`editable = false`).
6.  La información se propaga a los componentes de tarjeta (`SocioProfileCard`, etc.) para ser mostrada.
7.  Las acciones en `SocioActions` (como actualizar o eliminar) llaman a las funciones correspondientes en `SocioPage`, que a su vez usan el `SocioService`.