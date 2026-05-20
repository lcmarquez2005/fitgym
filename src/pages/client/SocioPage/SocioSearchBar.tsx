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
    <div className="relative">
      <div className="relative flex gap-3">
        <div className="relative flex-1">
          <label htmlFor="socio-search" className="sr-only">Buscar Socio</label>
          <div className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
          </div>
          <input
            id="socio-search"
            type="text"
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setSinResultados(false); setResultados([]); }}
            onKeyDown={(e) => e.key === "Enter" && buscarSocio()}
            placeholder="Buscar por nombre, ID o correo electrónico..."
            className="w-full py-3 pl-12 pr-10 text-sm font-medium transition-all duration-200 bg-white border-2 rounded-full outline-none flex-1 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            autoComplete="off"
          />
          {busqueda && (
            <button
              onClick={() => { setBusqueda(""); setResultados([]); setSinResultados(false); }}
              className="absolute p-0 -translate-y-1/2 bg-transparent border-none cursor-pointer right-3.5 top-1/2 text-slate-400"
              aria-label="Limpiar búsqueda"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white transition-all duration-200 bg-indigo-600 rounded-full shadow-lg hover:bg-indigo-700 shadow-indigo-500/30 disabled:bg-indigo-400 disabled:shadow-none" onClick={buscarSocio} disabled={buscando}>
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
        <div className="absolute z-10 w-full mt-2 overflow-hidden bg-white border shadow-xl rounded-2xl border-slate-200">
          {resultados.map((socio, _i) => (
            <button key={socio.id} className="flex items-center w-full gap-4 p-4 text-left transition-colors hover:bg-slate-50" onClick={() => seleccionarSocio(socio)}>
              <div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 bg-indigo-100 text-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="m-0 overflow-hidden text-sm font-bold text-ellipsis whitespace-nowrap text-slate-800">{socio.nombreCompleto}</p>
                <p className="m-0 text-xs text-slate-400">ID: {socio.idSocio} · {socio.email}</p>
              </div>
              <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full ${estatusColors[socio.estatus ?? ""] || "bg-slate-100 text-slate-500"}`}>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
                {socio.estatus}
              </span>
            </button>
          ))}
        </div>
      )}

      {sinResultados && (
        <div className="flex items-center gap-2 p-3 mt-2 text-sm bg-red-50 border border-red-200 rounded-lg text-red-600">
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
