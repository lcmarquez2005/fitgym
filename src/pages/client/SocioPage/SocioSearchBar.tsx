import React from "react";
import type { Socio } from "./types";

interface SocioSearchBarProps {
  busqueda: string;
  setBusqueda: (v: string) => void;
  buscando: boolean;
  sinResultados: boolean;
  resultados: Socio[];
  buscarSocio: () => void;
  seleccionarSocio: (socio: Socio) => void;
  setSinResultados: (v: boolean) => void;
  setResultados: (v: Socio[]) => void;
  estatusColors: Record<string, string>;
}

const SocioSearchBar: React.FC<SocioSearchBarProps> = ({
  busqueda,
  setBusqueda,
  buscando,
  sinResultados,
  resultados,
  buscarSocio,
  seleccionarSocio,
  setSinResultados,
  setResultados,
  estatusColors
}) => {
  return (
    <div style={{ marginBottom: 24 }}>
      <div className="search-wrap">
        <div style={{ position: "relative", flex: 1 }}>
          <div className="search-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setSinResultados(false); setResultados([]); }}
            onKeyDown={(e) => e.key === "Enter" && buscarSocio()}
            placeholder="Buscar por nombre, ID o correo electrónico..."
            className="search-input"
          />
          {busqueda && (
            <button
              onClick={() => { setBusqueda(""); setResultados([]); setSinResultados(false); }}
              style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button className="search-btn" onClick={buscarSocio} disabled={buscando}>
          {buscando ? (
            <svg className="animate-spin" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
          )}
          {buscando ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {resultados.length > 0 && (
        <div className="results-dropdown">
          {resultados.map((socio, i) => (
            <button key={socio.idSocio ?? i} className="result-item" onClick={() => seleccionarSocio(socio)}>
              <div className="result-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: "#1e293b", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{socio.nombreCompleto}</p>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>ID: {socio.idSocio} · {socio.email}</p>
              </div>
              <span className={`badge ${estatusColors[socio.estatus ?? ""] || "bg-slate-100 text-slate-500"}`}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                {socio.estatus}
              </span>
            </button>
          ))}
        </div>
      )}

      {sinResultados && (
        <div className="no-results">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          No se encontraron socios con ese criterio.
        </div>
      )}
    </div>
  );
};

export default SocioSearchBar;
