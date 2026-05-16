import React from "react";
import type { SocioFormData } from "./types";
import { useNavigate } from "react-router-dom";

interface SocioActionsProps {
  formData: SocioFormData;
  socioSeleccionadoId: string | null;
  editable: boolean;
  setEditable: (v: boolean) => void;
  setSocioSeleccionadoId: (id: string | null) => void;
  registrarSocio: (datos: SocioFormData) => Promise<any>;
  actualizarSocio: (id: string, datos: SocioFormData) => Promise<any>;
  eliminarSocio: (id: string) => Promise<any>;
}

const SocioActions: React.FC<SocioActionsProps> = ({
  formData,
  socioSeleccionadoId,
  editable,
  setEditable,
  setSocioSeleccionadoId,
  registrarSocio,
  actualizarSocio,
  eliminarSocio
}) => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <button className="action-btn btn-blue" onClick={() => navigate("/estado-cuenta")}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Estado de cuenta
      </button>

      {!socioSeleccionadoId && (
        <button
          className="action-btn btn-green"
          onClick={() => registrarSocio(formData).then(() => alert("Guardado exitoso")).catch(() => alert("Error al guardar"))}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Guardar socio
        </button>
      )}

      {socioSeleccionadoId && (
        <button
          disabled={!editable}
          className="action-btn btn-amber"
          onClick={() =>
            actualizarSocio(socioSeleccionadoId, formData)
              .then(() => { alert("Actualizado exitoso"); setEditable(false); })
              .catch(() => alert("Error al actualizar"))
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar socio
        </button>
      )}

      {socioSeleccionadoId && (
        <button
          className="action-btn btn-red"
          onClick={() => {
            if (window.confirm("¿Estás seguro de eliminar este socio?")) {
              eliminarSocio(socioSeleccionadoId)
                .then(() => { alert("Socio eliminado"); setSocioSeleccionadoId(null); setEditable(true); })
                .catch(() => alert("Error al eliminar"));
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Eliminar socio
        </button>
      )}
    </div>
  );
};

export default SocioActions;
