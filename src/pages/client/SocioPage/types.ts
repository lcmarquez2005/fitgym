export interface SocioFormData {
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
  descuento: string | number;
  costoMensual: string | number;
  fechaInicio: string;
  fechaFin: string;
  lesiones: string;
  alergias: string;
  extras: string;
}

export interface Socio {
  id?: string;
  idSocio?: string;
  nombreCompleto?: string;
  telefono?: string;
  email?: string;
  fechaNacimiento?: string;
  sexo?: string;
  contactoEmergencia?: string;
  telefonoEmergencia?: string;
  fechaRegistro?: string;
  estatus?: string;
  tipoMembresia?: string;
  descuento?: string | number;
  costoMensual?: string | number;
  fechaInicio?: string;
  fechaFin?: string;
  lesiones?: string;
  alergias?: string;
  extras?: string;
  foto?: string;
}
