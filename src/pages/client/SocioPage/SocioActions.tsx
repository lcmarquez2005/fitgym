import React from "react";
import type { ApiResponse } from "@services/socio.service";
import type { SocioFormData } from "./types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SocioActionsProps {
  formData: SocioFormData;
  socioSeleccionadoId: string | null;
  editable: boolean;
  setEditable: (v: boolean) => void;
  registrarSocio: (datos: SocioFormData) => Promise<ApiResponse>;
  actualizarSocio: (id: string, datos: SocioFormData) => Promise<ApiResponse>;
  eliminarSocio: (id: string) => Promise<ApiResponse>;
  limpiarFormulario: () => void;
}

const SocioActions: React.FC<SocioActionsProps> = ({
  formData,
  socioSeleccionadoId,
  editable,
  setEditable,
  registrarSocio,
  actualizarSocio,
  eliminarSocio,
  limpiarFormulario
}) => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-4 bg-white border shadow-sm rounded-2xl border-slate-200">
      {!socioSeleccionadoId && (
        <button
          className="flex items-center justify-center w-full gap-3 px-4 py-3 text-sm font-bold text-white transition-all duration-200 bg-green-600 rounded-xl hover:bg-green-700 shadow-lg shadow-green-500/20"
          onClick={async () => {
            try {
              await registrarSocio(formData);
              toast.success("Socio guardado exitosamente.");
              limpiarFormulario();
            } catch (error) {
              toast.error("Error al guardar el socio.");
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Guardar socio
        </button>
      )}

      {socioSeleccionadoId && (
        <>
          <button
            disabled={!editable}
            className="flex items-center justify-center w-full gap-3 px-4 py-3 text-sm font-bold text-white transition-all duration-200 bg-amber-500 rounded-xl hover:bg-amber-600 shadow-lg shadow-amber-500/20 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
            onClick={async () => {
              try {
                await actualizarSocio(socioSeleccionadoId, formData);
                toast.success("Socio actualizado exitosamente.");
                setEditable(false);
              } catch (error) {
                toast.error("Error al actualizar el socio.");
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar socio
          </button>
          <button
            className="flex items-center justify-center w-full gap-3 px-4 py-3 text-sm font-bold text-white transition-all duration-200 bg-red-600 rounded-xl hover:bg-red-700 shadow-lg shadow-red-500/20"
            onClick={() => {
              toast("¿Estás seguro de eliminar este socio?", {
                action: {
                  label: "Eliminar",
                  onClick: async () => {
                    try {
                      await eliminarSocio(socioSeleccionadoId);
                      toast.success("Socio eliminado.");
                    limpiarFormulario(); // This now correctly resets the form
                    } catch (error) {
                      toast.error("Error al eliminar el socio.");
                    }
                  },
                },
              });
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar socio
          </button>
          <button className="flex items-center justify-center w-full gap-3 px-4 py-3 text-sm font-bold text-white transition-all duration-200 bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20" onClick={() => navigate("/erp/estado-cuenta")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Estado de cuenta
          </button>
        </>
      )}
      <div className="pt-4 mt-4 border-t border-slate-200">
        <button
          className="flex items-center justify-center w-full gap-3 px-4 py-3 text-sm font-bold text-slate-600 transition-colors bg-slate-100 rounded-xl hover:bg-slate-200"
          onClick={limpiarFormulario}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Nuevo Socio / Limpiar
        </button>
      </div>
    </div>
  );
};

export default SocioActions;
