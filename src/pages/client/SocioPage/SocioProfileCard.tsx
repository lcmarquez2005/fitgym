import React, { type ChangeEvent } from "react";
import type { SocioFormData } from "./types";
import peopleImage from '@assets/people.png';

interface SocioProfileCardProps {
  formData: SocioFormData;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  editable: boolean;
  setEditable: (v: boolean) => void;
  inputClass: string;
  labelClass: string;
}

const SocioProfileCard: React.FC<SocioProfileCardProps> = ({
  formData,
  handleChange,
  editable,
  setEditable,
  inputClass,
  labelClass
}) => {
  return (
    <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200">
      {/* Dark header */}
      <div className="relative p-7 md:p-8 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="relative z-10 flex items-center justify-between mb-5">
          <span className="text-xs font-extrabold tracking-widest uppercase text-white/50 font-syne">
            Perfil del Socio
          </span>
          <button
            onClick={() => setEditable(!editable)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors rounded-full ${editable ? "bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/20" : "bg-white/10 text-white/80 border border-white/20 hover:bg-white/20"}`}
          >
            {editable ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Bloquear
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </>
            )}
          </button>
        </div>

        <div className="relative z-10 flex items-center gap-5">
          <div className="relative shrink-0">
            <div className="relative w-28 h-28 overflow-hidden border-4 rounded-full border-white/20">
              <img src={peopleImage} className="object-cover w-full h-full" alt="Foto Socio" />
            </div>
          </div>
          <div>
            <h2 className="m-0 mb-1 text-2xl font-extrabold leading-tight text-white font-syne">
              {formData.nombreCompleto || "Nuevo Socio"}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {formData.idSocio && (
                <span className="text-sm font-semibold text-white/50">#{formData.idSocio}</span>
              )}
              {formData.estatus && (
                <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold border rounded-full border-indigo-400/30 bg-indigo-500/20 text-indigo-300">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-300" />
                  {formData.estatus}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form body */}
      <div className="p-7 md:p-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-slate-600 uppercase bg-slate-100 border border-slate-200 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Datos personales
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="nombreCompleto" className={labelClass}>Nombre completo</label>
            <input id="nombreCompleto" name="nombreCompleto" value={formData.nombreCompleto} onChange={handleChange} disabled={!editable} placeholder="Nombre completo" className={inputClass} autoComplete="name" />
          </div>
          <div>
            <label htmlFor="telefono" className={labelClass}>Teléfono</label>
            <input id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} type="tel" disabled={!editable} placeholder="55 1234 5678" className={inputClass} autoComplete="tel" />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>Correo electrónico</label>
            <input id="email" name="email" value={formData.email} onChange={handleChange} type="email" disabled={!editable} placeholder="correo@ejemplo.com" className={inputClass} autoComplete="email" />
          </div>
          <div>
            <label htmlFor="fechaNacimiento" className={labelClass}>Fecha de nacimiento</label>
            <input id="fechaNacimiento" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} type="date" disabled={!editable} className={inputClass} autoComplete="bday" />
          </div>
          <div>
            <label htmlFor="sexo" className={labelClass}>Sexo</label>
            <select id="sexo" name="sexo" value={formData.sexo} onChange={handleChange} disabled={!editable} className={inputClass}>
              <option>Masculino</option>
              <option>Femenino</option>
              <option>Otro</option>
            </select>
          </div>
          <div>
            <label htmlFor="contactoEmergencia" className={labelClass}>Contacto de emergencia</label>
            <input id="contactoEmergencia" name="contactoEmergencia" value={formData.contactoEmergencia} onChange={handleChange} disabled={!editable} placeholder="Nombre del contacto" className={inputClass} autoComplete="off" />
          </div>
          <div>
            <label htmlFor="telefonoEmergencia" className={labelClass}>Teléfono de emergencia</label>
            <input id="telefonoEmergencia" name="telefonoEmergencia" value={formData.telefonoEmergencia} onChange={handleChange} type="tel" disabled={!editable} placeholder="55 9876 5432" className={inputClass} autoComplete="off" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocioProfileCard;
