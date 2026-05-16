import React, { type ChangeEvent } from "react";
import type { SocioFormData } from "./types";

interface SocioProfileCardProps {
  formData: SocioFormData;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  editable: boolean;
  setEditable: (v: boolean) => void;
  foto: string;
  handleFotoChange: (e: ChangeEvent<HTMLInputElement>) => void;
  inputClass: string;
  labelClass: string;
}

const SocioProfileCard: React.FC<SocioProfileCardProps> = ({
  formData,
  handleChange,
  editable,
  setEditable,
  foto,
  handleFotoChange,
  inputClass,
  labelClass
}) => {
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      {/* Dark header */}
      <div className="card-header">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, position: "relative", zIndex: 1 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1.5px" }}>
            Perfil del Socio
          </span>
          <button
            onClick={() => setEditable(!editable)}
            className={`edit-toggle-btn ${editable ? "editing" : "locked"}`}
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

        <div style={{ display: "flex", alignItems: "center", gap: 20, position: "relative", zIndex: 1 }}>
          <div style={{ position: "relative" }}>
            <div className="photo-ring">
              <img src={foto} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Foto Socio" />
              {editable && (
                <label htmlFor="foto-input" className="photo-overlay">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span style={{ fontSize: 10, fontWeight: 700 }}>Cambiar foto</span>
                </label>
              )}
            </div>
            <input id="foto-input" type="file" accept="image/*" style={{ display: "none" }} onChange={handleFotoChange} disabled={!editable} />
          </div>
          <div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "white", margin: "0 0 4px", lineHeight: 1.2 }}>
              {formData.nombreCompleto || "Nuevo Socio"}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              {formData.idSocio && (
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>#{formData.idSocio}</span>
              )}
              {formData.estatus && (
                <span className="badge" style={{
                  background: "rgba(99,102,241,0.2)",
                  color: "#a5b4fc",
                  border: "1px solid rgba(99,102,241,0.3)",
                  fontSize: 11
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#a5b4fc", display: "inline-block" }} />
                  {formData.estatus}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form body */}
      <div style={{ padding: "28px 32px" }}>
        <div className="section-chip">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Datos personales
        </div>
        <div className="grid-2">
          <div>
            <label className={labelClass}>Nombre completo</label>
            <input name="nombreCompleto" value={formData.nombreCompleto} onChange={handleChange} disabled={!editable} placeholder="Nombre completo" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Teléfono</label>
            <input name="telefono" value={formData.telefono} onChange={handleChange} type="tel" disabled={!editable} placeholder="55 1234 5678" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Correo electrónico</label>
            <input name="email" value={formData.email} onChange={handleChange} type="email" disabled={!editable} placeholder="correo@ejemplo.com" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Fecha de nacimiento</label>
            <input name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} type="date" disabled={!editable} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Sexo</label>
            <select name="sexo" value={formData.sexo} onChange={handleChange} disabled={!editable} className={inputClass}>
              <option>Masculino</option>
              <option>Femenino</option>
              <option>Otro</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Contacto de emergencia</label>
            <input name="contactoEmergencia" value={formData.contactoEmergencia} onChange={handleChange} disabled={!editable} placeholder="Nombre del contacto" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Teléfono de emergencia</label>
            <input name="telefonoEmergencia" value={formData.telefonoEmergencia} onChange={handleChange} type="tel" disabled={!editable} placeholder="55 9876 5432" className={inputClass} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocioProfileCard;
