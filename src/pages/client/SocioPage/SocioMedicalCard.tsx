import React, { type ChangeEvent } from "react";
import type { SocioFormData } from "./types";

interface SocioMedicalCardProps {
  formData: SocioFormData;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  editable: boolean;
  inputClass: string;
  labelClass: string;
  fingerprintImg: string;
}

const SocioMedicalCard: React.FC<SocioMedicalCardProps> = ({
  formData,
  handleChange,
  editable,
  inputClass,
  labelClass,
  fingerprintImg
}) => {
  return (
    <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200">
      <div className="p-7 md:p-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-slate-600 uppercase bg-slate-100 border border-slate-200 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Información médica
        </div>

        <div className="flex items-center justify-between gap-4 py-3.5 border-b border-slate-100">
          <label htmlFor="lesiones" className="text-sm font-semibold text-slate-500">Lesiones</label>
          <div className="flex-1">
            <input id="lesiones" name="lesiones" value={formData.lesiones} onChange={handleChange} disabled={!editable} placeholder="Describe lesiones..." className={inputClass} autoComplete="off" />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 py-3.5 border-b border-slate-100 mb-4">
          <label htmlFor="alergias" className="text-sm font-semibold text-slate-500">Alergias</label>
          <div className="flex-1">
            <input id="alergias" name="alergias" value={formData.alergias} onChange={handleChange} disabled={!editable} placeholder="Describe alergias..." className={inputClass} autoComplete="off" />
          </div>
        </div>

        <label htmlFor="extras" className={labelClass}>Notas adicionales</label>
        <textarea
          id="extras"
          name="extras"
          placeholder="Observaciones, notas especiales, rutinas..."
          value={formData.extras}
          onChange={handleChange}
          rows={3}
          disabled={!editable}
          className="w-full p-4 mt-1 text-sm transition-all duration-200 bg-white border-2 rounded-xl border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white disabled:bg-slate-50 disabled:border-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
          autoComplete="off"
        />

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
          <div>
            <span className="text-sm font-bold text-slate-600">Huella digital / QR</span>
            <p className="mt-0.5 text-xs text-slate-400">Identificación biométrica del socio</p>
          </div>
          <img src={fingerprintImg} className="object-contain w-16 h-16 opacity-70" alt="Huella" />
        </div>
      </div>
    </div>
  );
};

export default SocioMedicalCard;
