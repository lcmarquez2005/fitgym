import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

export default function SocioPage() {
  const navigate = useNavigate();

  const images = {
    userPhoto: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/bp4d6fgu_expires_30_days.png",
    statusIcon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/7rubqqgd_expires_30_days.png",
    fingerprint: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/z8h8ojz9_expires_30_days.png",
  };

  const [foto, setFoto] = useState(images.userPhoto);
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [sinResultados, setSinResultados] = useState(false);
  const [socioSeleccionadoId, setSocioSeleccionadoId] = useState(null);
  const [editable, setEditable] = useState(true);

  const handleFotoChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      const url = URL.createObjectURL(archivo);
      setFoto(url);
    }
  };

  const [formData, setFormData] = useState({
    nombreCompleto: "",
    telefono: "",
    email: "",
    fechaNacimiento: "",
    sexo: "Masculino",
    contactoEmergencia: "",
    telefonoEmergencia: "",
    idSocio: "",
    fechaRegistro: "",
    estatus: "Activo",
    tipoMembresia: "Individual",
    descuento: "",
    costoMensual: "",
    fechaInicio: "",
    fechaFin: "",
    lesiones: "",
    alergias: "",
    extras: "",
  });

  const handleChange = (e) => {
    if (!editable) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buscarSocio = async () => {
    if (!busqueda.trim()) return;
    setBuscando(true);
    setSinResultados(false);
    setResultados([]);
    try {
      const urlBase = import.meta.env.VITE_API_URL;
      const res = await fetch(`${urlBase}/socios/buscar?q=${encodeURIComponent(busqueda)}`);
      const json = await res.json();
      const lista = Array.isArray(json) ? json : json.data ?? [];
      if (lista.length === 0) setSinResultados(true);
      else setResultados(lista);
    } catch (err) {
      console.error("Error al buscar:", err);
    } finally {
      setBuscando(false);
    }
  };

  const seleccionarSocio = (socio) => {
    setFormData({
      nombreCompleto: socio.nombreCompleto ?? "",
      telefono: socio.telefono ?? "",
      email: socio.email ?? "",
      fechaNacimiento: socio.fechaNacimiento ?? "",
      sexo: socio.sexo ?? "Masculino",
      contactoEmergencia: socio.contactoEmergencia ?? "",
      telefonoEmergencia: socio.telefonoEmergencia ?? "",
      idSocio: socio.idSocio ?? "",
      fechaRegistro: socio.fechaRegistro ?? "",
      estatus: socio.estatus ?? "Activo",
      tipoMembresia: socio.tipoMembresia ?? "Individual",
      descuento: socio.descuento ?? "0",
      costoMensual: socio.costoMensual ?? "0",
      fechaInicio: socio.fechaInicio ?? "",
      fechaFin: socio.fechaFin ?? "",
      lesiones: socio.lesiones ?? "Ninguna",
      alergias: socio.alergias ?? "Ninguna",
      extras: socio.extras ?? "",
    });
    if (socio.foto) setFoto(socio.foto);
    setSocioSeleccionadoId(socio.id);
    setEditable(false);
    setResultados([]);
    setBusqueda("");
    setSinResultados(false);
  };

  const registrarSocio = async (datos) => {
    const urlBase = import.meta.env.VITE_API_URL;
    const respuesta = await fetch(`${urlBase}/socios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    return await respuesta.json();
  };

  const actualizarSocio = async (id, datos) => {
    const urlBase = import.meta.env.VITE_API_URL;
    const respuesta = await fetch(`${urlBase}/socios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    return await respuesta.json();
  };

  const eliminarSocio = async (id) => {
    const urlBase = import.meta.env.VITE_API_URL;
    const respuesta = await fetch(`${urlBase}/socios/${id}`, { method: "DELETE" });
    return await respuesta.json();
  };

  const inputBase = `w-full text-sm font-medium px-4 py-3 rounded-xl border outline-none transition-all duration-200`;
  const inputEnabled = `bg-white border-slate-200 text-slate-800 placeholder-slate-400
    focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white`;
  const inputDisabled = `bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed`;
  const inputClass = `${inputBase} ${editable ? inputEnabled : inputDisabled}`;

  const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5";

  const estatusColors = {
    Activo: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    Suspendido: "bg-amber-50 text-amber-600 border border-amber-200",
    Inactivo: "bg-slate-100 text-slate-500 border border-slate-200",
    Pendiente: "bg-blue-50 text-blue-600 border border-blue-200",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .socio-root {
          font-family: 'DM Sans', sans-serif;
          background: #f1f5f9;
          min-height: 100vh;
        }
        .socio-root * { box-sizing: border-box; }

        .section-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
        }

        .card {
          background: white;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .card-header {
          background: linear-gradient(135deg, #2773ee 0%, #4cb0ea 100%);
          padding: 28px 32px;
          position: relative;
          overflow: hidden;
        }
        .card-header::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 160px; height: 160px;
          border-radius: 50%;
          background: rgba(99,102,241,0.15);
        }
        .card-header::after {
          content: '';
          position: absolute;
          bottom: -30px; left: 60px;
          width: 100px; height: 100px;
          border-radius: 50%;
          background: rgba(99,102,241,0.08);
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
        }

        .pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
          border: none;
        }
        .pill-btn:active { transform: scale(0.97); }

        .search-wrap {
          position: relative;
          display: flex;
          gap: 12px;
        }
        .search-input {
          flex: 1;
          padding: 14px 20px 14px 48px;
          border-radius: 16px;
          border: 2px solid #e2e8f0;
          background: white;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #1e293b;
          outline: none;
          transition: all 0.2s;
        }
        .search-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
        }
        .search-icon-wrap {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }
        .search-btn {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
          border: none;
          border-radius: 16px;
          padding: 14px 24px;
          font-weight: 700;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(99,102,241,0.3);
        }
        .search-btn:hover { box-shadow: 0 6px 20px rgba(99,102,241,0.4); transform: translateY(-1px); }
        .search-btn:active { transform: scale(0.97); }
        .search-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .results-dropdown {
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          overflow: hidden;
          margin-top: 8px;
        }
        .result-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 20px;
          cursor: pointer;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          border-bottom: 1px solid #f8fafc;
          transition: background 0.15s;
        }
        .result-item:last-child { border-bottom: none; }
        .result-item:hover { background: #f8fafc; }
        .result-avatar {
          width: 40px; height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #ede9fe, #ddd6fe);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: #6366f1;
        }

        .photo-ring {
          width: 120px; height: 120px;
          border-radius: 50%;
          border: 3px solid rgba(255,255,255,0.2);
          overflow: hidden;
          flex-shrink: 0;
          position: relative;
        }
        .photo-overlay {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(15,23,42,0.6);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
          cursor: pointer;
          color: white;
          gap: 4px;
        }
        .photo-ring:hover .photo-overlay { opacity: 1; }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 640px) {
          .grid-2 { grid-template-columns: 1fr; }
          .card-header { padding: 20px; }
        }

        .divider { height: 1px; background: #f1f5f9; margin: 0 -32px; }

        .cost-card {
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          border: 1px solid #bfdbfe;
          border-radius: 16px;
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .action-btn {
          width: 100%;
          border: none;
          border-radius: 16px;
          padding: 16px;
          font-size: 16px;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
          letter-spacing: 0.3px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .action-btn:hover { transform: translateY(-2px); }
        .action-btn:active { transform: scale(0.98); }
        .action-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

        .btn-blue { background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; box-shadow: 0 4px 16px rgba(99,102,241,0.3); }
        .btn-blue:hover { box-shadow: 0 8px 24px rgba(99,102,241,0.4); }
        .btn-green { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; box-shadow: 0 4px 16px rgba(34,197,94,0.3); }
        .btn-green:hover { box-shadow: 0 8px 24px rgba(34,197,94,0.4); }
        .btn-amber { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; box-shadow: 0 4px 16px rgba(245,158,11,0.3); }
        .btn-amber:hover { box-shadow: 0 8px 24px rgba(245,158,11,0.4); }
        .btn-red { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; box-shadow: 0 4px 16px rgba(239,68,68,0.25); }
        .btn-red:hover { box-shadow: 0 8px 24px rgba(239,68,68,0.35); }

        .section-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
        }

        .no-results {
          background: white;
          border-radius: 14px;
          border: 1px solid #fee2e2;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #f87171;
          font-size: 13px;
          font-weight: 500;
          margin-top: 8px;
        }

        .id-input {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: white;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 10px;
          padding: 2px 12px;
          outline: none;
          width: 180px;
          transition: all 0.2s;
        }
        .id-input:focus { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.4); }
        .id-input:disabled { opacity: 0.5; cursor: not-allowed; }

        .cost-input {
          font-family: 'Syne', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #1e3a8a;
          background: white;
          border: 2px solid #bfdbfe;
          border-radius: 12px;
          padding: 4px 14px;
          outline: none;
          width: 130px;
          text-align: right;
          transition: all 0.2s;
        }
        .cost-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .cost-input:disabled { opacity: 0.5; cursor: not-allowed; }

        .extras-textarea {
          width: 100%;
          padding: 16px;
          border-radius: 14px;
          border: 2px solid #e2e8f0;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #334155;
          resize: none;
          outline: none;
          transition: all 0.2s;
          background: #f8fafc;
        }
        .extras-textarea:focus { border-color: #6366f1; background: white; box-shadow: 0 0 0 3px rgba(99,102,241,0.08); }
        .extras-textarea:disabled { opacity: 0.6; cursor: not-allowed; background: #f1f5f9; }
        .extras-textarea::placeholder { color: #94a3b8; }

        .edit-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.18s;
          font-family: 'DM Sans', sans-serif;
        }
        .edit-toggle-btn.locked {
          background: rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.9);
          border: 1px solid rgba(255,255,255,0.2);
        }
        .edit-toggle-btn.locked:hover { background: rgba(255,255,255,0.22); }
        .edit-toggle-btn.editing {
          background: rgba(239,68,68,0.15);
          color: #fca5a5;
          border: 1px solid rgba(239,68,68,0.3);
        }
        .edit-toggle-btn.editing:hover { background: rgba(239,68,68,0.25); }

        .row-field {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0;
          border-bottom: 1px solid #f1f5f9;
          gap: 16px;
        }
        .row-field:last-child { border-bottom: none; }
        .row-label {
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          min-width: 140px;
          flex-shrink: 0;
        }
        .row-input {
          flex: 1;
          max-width: 220px;
        }
      `}</style>

      <div className="socio-root">
        <Header />

        <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 16px 48px" }}>

          {/* ── SEARCH BAR ── */}
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
                    <span className={`badge ${estatusColors[socio.estatus] || "bg-slate-100 text-slate-500"}`}>
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

          {/* ── CARD 1: PERFIL ── */}
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

          {/* ── CARD 2: MEMBRESÍA ── */}
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

          {/* ── CARD 3: MÉDICA ── */}
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
                <img src={images.fingerprint} style={{ width: 64, height: 64, objectFit: "contain", opacity: 0.7 }} alt="Huella" />
              </div>
            </div>
          </div>

          {/* ── ACCIONES ── */}
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
        </div>

        <Footer />
      </div>
    </>
  );
}
