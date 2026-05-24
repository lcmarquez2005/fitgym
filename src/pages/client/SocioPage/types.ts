/**
 * Represents the data structure of a member as it comes from the API
 * (JOIN between usuarios and socios). This is the source of truth for display.
 */
export interface Socio {
  id: string; // This is socios.id, the primary key for the socio record
  usuarioId: number;

  // From usuarios table
  name: string;
  lastName: string;
  nombreCompleto: string;
  email: string;
  noControl?: string;
  foto?: string;
  huellaDigital?: string;
  rol?: string;

  // From socios table
  idSocio: string;
  contactoEmergencia?: string;
  telefonoEmergencia?: string;
  tipoMembresia?: string;
  descuento?: string;
  costoMensual?: string;
  fechaInicio?: string;
  fechaFin?: string;
  fechaRegistro?: string;
  estatus?: string;
  lesiones?: string;
  alergias?: string;
  extras?: string;
}

/**
 * Represents the data structure for the form.
 * All fields are strings to be compatible with input elements.
 * This should reflect all fields present in the form cards.
 */
export interface SocioFormData {
  id?: string; // The socio.id, used for updates
  nombreCompleto: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  sexo: string;
  contactoEmergencia: string;
  telefonoEmergencia: string;
  idSocio: string;
  fechaRegistro: string;
  estatus: string;
  tipoMembresia: string;
  descuento: string;
  costoMensual: string;
  fechaInicio: string;
  fechaFin: string;
  lesiones: string;
  alergias: string;
  extras: string;
  foto?: string;
}

export interface SearchFilters {
  searchTerm: string;
  statusFilter?: string;
}

export type ViewMode = 'profile' | 'medical' | 'membership';