import React, { type ChangeEvent } from "react";
import type { SocioFormData } from "./types";
import { BiometricInput, CameraInput } from "@/components";
import peopleImage from '@assets/people.png';

interface SocioMedicalCardProps {
  formData: SocioFormData;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  editable: boolean;
  inputClass: string;
  labelClass: string;
  fingerprintImg: string;
  isCapturingFingerprint: boolean;
  onFingerprintCapture: () => void;
  uploadingPhoto: boolean;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SocioMedicalCard: React.FC<SocioMedicalCardProps> = ({
  formData,
  handleChange,
  editable,
  inputClass,
  labelClass,
  isCapturingFingerprint,
  onFingerprintCapture,
  uploadingPhoto,
  onPhotoChange
}) => {
  return (
    <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200">
      <div className="p-7 md:p-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-slate-600 uppercase bg-slate-100 border border-slate-200 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Información médica y Biometría
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="lesiones" className={labelClass}>Lesiones</label>
              <input id="lesiones" name="lesiones" value={formData.lesiones} onChange={handleChange} disabled={!editable} placeholder="Describe lesiones..." className={inputClass} autoComplete="off" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="alergias" className={labelClass}>Alergias</label>
              <input id="alergias" name="alergias" value={formData.alergias} onChange={handleChange} disabled={!editable} placeholder="Describe alergias..." className={inputClass} autoComplete="off" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="extras" className={labelClass}>Notas adicionales</label>
            <textarea
              id="extras"
              name="extras"
              placeholder="Observaciones, notas especiales, rutinas..."
              value={formData.extras}
              onChange={handleChange}
              rows={4}
              disabled={!editable}
              className="w-full p-4 text-sm transition-all duration-200 bg-white border rounded-xl border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white disabled:bg-slate-50 disabled:border-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Identificación Biométrica</h3>
            <p className="text-xs text-slate-400">Captura la huella y foto oficial para el acceso al gimnasio</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-8 py-8 bg-slate-50/50 rounded-[32px] border border-slate-100 p-6">
            <div className={!editable ? "opacity-60 pointer-events-none" : ""}>
              <BiometricInput
                fingerprintStatus={!!formData.huellaDigital}
                onFingerprintCapture={onFingerprintCapture}
                isCapturing={isCapturingFingerprint}
              />
            </div>
            
            <div className={!editable ? "opacity-60 pointer-events-none" : ""}>
              <CameraInput
                photoPreview={peopleImage}
                onPhotoChange={onPhotoChange}
                uploading={uploadingPhoto}
              />
            </div>
          </div>
          
          {!editable && (
            <p className="mt-4 text-[10px] text-center text-slate-400 uppercase font-bold italic">
              Activa la edición para actualizar los datos biométricos
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocioMedicalCard;
