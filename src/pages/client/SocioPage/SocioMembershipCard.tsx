import React, { type ChangeEvent } from "react";
import type { SocioFormData } from "./types";

interface SocioMembershipCardProps {
  formData: SocioFormData;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  editable: boolean;
  inputClass: string;
  labelClass: string;
}

const SocioMembershipCard: React.FC<SocioMembershipCardProps> = ({
  formData,
  handleChange,
  editable,
  inputClass,
  labelClass
}) => {
  return (
    <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200">
      <div className="p-7 md:p-8">
        {/* ID + Fecha registro */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <label htmlFor="idSocio" className="block mb-1 text-xs font-bold tracking-widest text-slate-400 uppercase">ID de Socio</label>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-extrabold text-slate-800 font-syne">#</span>
              <input
                id="idSocio"
                name="idSocio"
                value={formData.idSocio}
                readOnly
                placeholder="00001"
                className="w-40 p-1 text-3xl font-extrabold transition-all bg-transparent border-none outline-none font-syne text-slate-800 cursor-default"
                autoComplete="off"
                title="El ID se genera automáticamente"
              />
            </div>
          </div>
          <div className="text-right">
            <label htmlFor="fechaRegistro" className={`${labelClass} text-right`}>Fecha de registro</label>
            <input 
              id="fechaRegistro" 
              name="fechaRegistro" 
              value={formData.fechaRegistro} 
              type="date" 
              readOnly
              className="text-sm font-bold text-slate-600 text-right bg-transparent border-none outline-none cursor-default max-w-[180px]" 
              autoComplete="off" 
              title="La fecha de registro se asigna automáticamente"
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-slate-600 uppercase bg-slate-100 border border-slate-200 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Membresía
        </div>

        <div className="flex items-center justify-between gap-4 py-3.5 border-b border-slate-100">
          <label htmlFor="estatus" className="text-sm font-semibold text-slate-500">Estatus</label>
          <div className="flex-1 max-w-[220px]">
            <select id="estatus" name="estatus" value={formData.estatus} onChange={handleChange} disabled={!editable} className={`${inputClass} max-w-[200px]`}>
              <option>Activo</option>
              <option>Suspendido</option>
              <option>Inactivo</option>
              <option>Pendiente</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 py-3.5 border-b border-slate-100">
          <label htmlFor="tipoMembresia" className="text-sm font-semibold text-slate-500">Tipo de membresía</label>
          <div className="flex-1 max-w-[220px]">
            <select id="tipoMembresia" name="tipoMembresia" value={formData.tipoMembresia} onChange={handleChange} disabled={!editable} className={`${inputClass} max-w-[200px]`}>
              <option>Individual</option>
              <option>Familiar</option>
              <option>Estudiante</option>
              <option>VIP</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 py-3.5 border-b border-slate-100">
          <label htmlFor="descuento" className="text-sm font-semibold text-slate-500">Descuento (%)</label>
          <div className="flex-1 max-w-[220px]">
            <input id="descuento" name="descuento" value={formData.descuento} onChange={handleChange} type="number" min="0" max="100" disabled={!editable}
              className={`${inputClass} max-w-[120px] font-bold text-red-500`}
              autoComplete="off"
            />
          </div>
        </div>

        {/* Costo mensual highlight */}
        <div className="flex items-center justify-between p-5 my-5 bg-blue-50 border border-blue-200 rounded-xl">
          <div>
            <label htmlFor="costoMensual" className="text-xs font-bold tracking-wider text-blue-500 uppercase">Costo mensual</label>
            <p className="mt-0.5 text-sm font-medium text-blue-400">Tarifa base del socio</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-2xl font-extrabold text-blue-900 font-syne">$</span>
            <input
              id="costoMensual"
              name="costoMensual"
              value={formData.costoMensual}
              onChange={handleChange}
              type="number"
              disabled={!editable}
              className="w-32 p-2 text-2xl font-extrabold text-right text-blue-900 transition-all bg-white border-2 border-blue-200 rounded-lg outline-none font-syne focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-blue-100/50 disabled:cursor-not-allowed"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="fechaInicio" className={labelClass}>Fecha de inicio</label>
            <input id="fechaInicio" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} type="date" disabled={!editable} className={inputClass} autoComplete="off" />
          </div>
          <div>
            <label htmlFor="fechaFin" className={labelClass}>Fecha de fin</label>
            <input id="fechaFin" name="fechaFin" value={formData.fechaFin} onChange={handleChange} type="date" disabled={!editable} className={inputClass} autoComplete="off" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocioMembershipCard;
