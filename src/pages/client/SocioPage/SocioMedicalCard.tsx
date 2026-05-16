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
    <div className="card" style={{ marginBottom: 24 }}>
      <div style={{ padding: "28px 32px" }}>
        <div className="section-chip">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Información médica
        </div>

        <div className="row-field">
          <span className="row-label">Lesiones</span>
          <div style={{ flex: 1 }}>
            <input name="lesiones" value={formData.lesiones} onChange={handleChange} disabled={!editable} placeholder="Describe lesiones..." className={inputClass} />
          </div>
        </div>
        <div className="row-field" style={{ marginBottom: 16 }}>
          <span className="row-label">Alergias</span>
          <div style={{ flex: 1 }}>
            <input name="alergias" value={formData.alergias} onChange={handleChange} disabled={!editable} placeholder="Describe alergias..." className={inputClass} />
          </div>
        </div>

        <label className={labelClass}>Notas adicionales</label>
        <textarea
          name="extras"
          placeholder="Observaciones, notas especiales, rutinas..."
          value={formData.extras}
          onChange={handleChange}
          rows={3}
          disabled={!editable}
          className="extras-textarea"
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>Huella digital / QR</span>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0" }}>Identificación biométrica del socio</p>
          </div>
          <img src={fingerprintImg} style={{ width: 64, height: 64, objectFit: "contain", opacity: 0.7 }} alt="Huella" />
        </div>
      </div>
    </div>
  );
};

export default SocioMedicalCard;
