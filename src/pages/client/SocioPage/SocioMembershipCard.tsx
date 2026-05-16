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
    <div className="card" style={{ marginBottom: 16 }}>
      <div style={{ padding: "28px 32px" }}>
        {/* ID + Fecha registro */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 4 }}>ID de Socio</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, color: "#1e293b" }}>#</span>
              <input
                name="idSocio"
                value={formData.idSocio}
                onChange={handleChange}
                disabled={!editable}
                placeholder="00001"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#1e293b",
                  background: editable ? "#f8fafc" : "#f1f5f9",
                  border: "2px solid " + (editable ? "#e2e8f0" : "#f1f5f9"),
                  borderRadius: 10,
                  padding: "2px 12px",
                  outline: "none",
                  width: 160,
                  cursor: editable ? "text" : "not-allowed",
                  transition: "all 0.2s"
                }}
              />
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <label className={labelClass} style={{ textAlign: "right" }}>Fecha de registro</label>
            <input name="fechaRegistro" value={formData.fechaRegistro} onChange={handleChange} type="date" disabled={!editable} className={inputClass} style={{ maxWidth: 180 }} />
          </div>
        </div>

        <div className="section-chip">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Membresía
        </div>

        <div className="row-field">
          <span className="row-label">Estatus</span>
          <div className="row-input">
            <select name="estatus" value={formData.estatus} onChange={handleChange} disabled={!editable} className={inputClass} style={{ maxWidth: 200 }}>
              <option>Activo</option>
              <option>Suspendido</option>
              <option>Inactivo</option>
              <option>Pendiente</option>
            </select>
          </div>
        </div>
        <div className="row-field">
          <span className="row-label">Tipo de membresía</span>
          <div className="row-input">
            <select name="tipoMembresia" value={formData.tipoMembresia} onChange={handleChange} disabled={!editable} className={inputClass} style={{ maxWidth: 200 }}>
              <option>Individual</option>
              <option>Familiar</option>
              <option>Estudiante</option>
              <option>VIP</option>
            </select>
          </div>
        </div>
        <div className="row-field">
          <span className="row-label">Descuento (%)</span>
          <div className="row-input">
            <input name="descuento" value={formData.descuento} onChange={handleChange} type="number" min="0" max="100" disabled={!editable}
              className={inputClass}
              style={{ maxWidth: 120, color: "#ef4444", fontWeight: 700 }}
            />
          </div>
        </div>

        {/* Costo mensual highlight */}
        <div className="cost-card" style={{ margin: "20px 0" }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.5px" }}>Costo mensual</span>
            <p style={{ fontSize: 11, color: "#60a5fa", margin: "2px 0 0", fontWeight: 500 }}>Tarifa base del socio</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: "#1e3a8a" }}>$</span>
            <input
              name="costoMensual"
              value={formData.costoMensual}
              onChange={handleChange}
              type="number"
              disabled={!editable}
              className="cost-input"
            />
          </div>
        </div>

        <div className="grid-2">
          <div>
            <label className={labelClass}>Fecha de inicio</label>
            <input name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} type="date" disabled={!editable} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Fecha de fin</label>
            <input name="fechaFin" value={formData.fechaFin} onChange={handleChange} type="date" disabled={!editable} className={inputClass} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocioMembershipCard;
