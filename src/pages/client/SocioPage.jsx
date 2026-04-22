import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer"
import Header from "../../components/Header"

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

  const handleFotoChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      const url = URL.createObjectURL(archivo);
      setFoto(url);
    }
  };

  const [formData, setFormData] = useState({
    nombreCompleto: "Juan Carlos Roa",
    telefono: "085258974410",
    email: "ejemplo@gmail.com",
    fechaNacimiento: "1990-05-24",
    sexo: "Masculino",
    contactoEmergencia: "Maria Roa",
    telefonoEmergencia: "7777777777",
    idSocio: "10238",
    fechaRegistro: "2024-01-10",
    estatus: "Activo",
    tipoMembresia: "Individual",
    descuento: "10",
    costoMensual: "500",
    fechaInicio: "2024-01-01",
    fechaFin: "2024-02-01",
    lesiones: "Ninguna",
    alergias: "Ninguna",
    extras: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── BÚSQUEDA ──────────────────────────────────────────────
  const buscarSocio = async () => {
    if (!busqueda.trim()) return;
    setBuscando(true);
    setSinResultados(false);
    setResultados([]);
    try {
      const urlBase = import.meta.env.VITE_API_URL;
      const res = await fetch(`${urlBase}/socios/buscar?q=${encodeURIComponent(busqueda)}`);
      const data = await res.json();
      if (data.length === 0) {
        setSinResultados(true);
      } else {
        setResultados(data);
      }
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
    setResultados([]);
    setBusqueda("");
    setSinResultados(false);
  };
  // ─────────────────────────────────────────────────────────

  const registrarSocio = async (datos) => {
    const urlBase = import.meta.env.VITE_API_URL;
    const respuesta = await fetch(`${urlBase}/socios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    return await respuesta.json();
  };

  const inputClass = "w-full bg-[#EEF4FF] text-black text-base font-medium px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#3851EE] focus:ring-2 focus:ring-[#3851EE]/20 transition";
  const labelClass = "block text-gray-600 text-xs font-bold uppercase mb-1";

  return (
    <div className="flex flex-col min-h-screen bg-[#CCF1FF] font-sans">

      <Header />

      <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4 pb-10 gap-6">

        {/* ── BARRA DE BÚSQUEDA ── */}
        <div className="w-full mt-4">
          <div className="relative flex items-center gap-2">

            {/* Input de búsqueda */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setSinResultados(false);
                  setResultados([]);
                }}
                onKeyDown={(e) => e.key === "Enter" && buscarSocio()}
                placeholder="Buscar socio por nombre, ID o email..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-white bg-white text-black text-base font-medium shadow-sm outline-none focus:border-[#3851EE] focus:ring-2 focus:ring-[#3851EE]/20 transition placeholder-gray-400"
              />
              {/* Botón limpiar */}
              {busqueda && (
                <button
                  onClick={() => { setBusqueda(""); setResultados([]); setSinResultados(false); }}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Botón Buscar */}
            <button
              onClick={buscarSocio}
              disabled={buscando}
              className="bg-[#3851EE] hover:bg-[#2b41cc] disabled:opacity-60 text-white font-bold px-6 py-4 rounded-2xl shadow-sm active:scale-95 transition-all flex items-center gap-2 shrink-0"
            >
              {buscando ? (
                <svg className="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
              )}
              {buscando ? "Buscando..." : "Buscar"}
            </button>
          </div>

          {/* Dropdown de resultados */}
          {resultados.length > 0 && (
            <div className="mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-10">
              {resultados.map((socio, i) => (
                <button
                  key={socio.idSocio ?? i}
                  onClick={() => seleccionarSocio(socio)}
                  className="w-full flex items-center gap-4 px-6 py-4 hover:bg-[#EEF4FF] transition text-left border-b border-gray-50 last:border-none"
                >
                  <div className="w-10 h-10 rounded-full bg-[#3851EE]/10 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#3851EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1118.88 6.196 9 9 0 015.12 17.804z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-black text-sm truncate">{socio.nombreCompleto}</p>
                    <p className="text-gray-400 text-xs truncate">ID: {socio.idSocio} · {socio.email}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${socio.estatus === "Activo" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                    {socio.estatus}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Sin resultados */}
          {sinResultados && (
            <div className="mt-2 bg-white rounded-2xl px-6 py-4 text-gray-400 text-sm font-medium shadow-sm border border-gray-100 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              No se encontraron socios con ese criterio.
            </div>
          )}
        </div>
        {/* ── FIN BARRA DE BÚSQUEDA ── */}

        {/* --- TARJETA AMARILLA (Datos Personales) --- */}
        <div className="flex flex-col items-center w-full bg-[#FFFECD] rounded-[32px] p-8 shadow-sm relative">

          <div className="flex flex-col md:flex-row items-center gap-8 mb-8 w-full border-b border-black/10 pb-6">
            <div className="relative w-40 h-40 shrink-0 group">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-200">
                <img src={foto} className="w-full h-full object-cover" alt="Foto Socio" />
              </div>
              <label
                htmlFor="foto-input"
                className="absolute inset-0 rounded-full flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-white text-xs font-bold">Cambiar foto</span>
              </label>
              <input id="foto-input" type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
            </div>
            <h2 className="text-black text-3xl font-bold uppercase text-center md:text-left">Información del socio</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-y-6 gap-x-12">
            <div>
              <label className={labelClass}>Nombre completo</label>
              <input name="nombreCompleto" value={formData.nombreCompleto} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Teléfono</label>
              <input name="telefono" value={formData.telefono} onChange={handleChange} type="tel" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input name="email" value={formData.email} onChange={handleChange} type="email" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Fecha de nacimiento</label>
              <input name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} type="date" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Sexo</label>
              <select name="sexo" value={formData.sexo} onChange={handleChange} className={inputClass}>
                <option>Masculino</option>
                <option>Femenino</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Contacto de emergencia</label>
              <input name="contactoEmergencia" value={formData.contactoEmergencia} onChange={handleChange} className={inputClass} placeholder="Nombre" />
            </div>
            <div className="md:col-span-2 md:w-1/2">
              <label className={labelClass}>Teléfono de emergencia</label>
              <input name="telefonoEmergencia" value={formData.telefonoEmergencia} onChange={handleChange} type="tel" className={inputClass} />
            </div>
          </div>
        </div>

        {/* --- TARJETA BLANCA DE DATOS --- */}
        <div className="flex flex-col w-full bg-[#F6F8FE] rounded-[32px] p-4 gap-4">

          <div className="bg-white rounded-[24px] p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-6">
              <h3 className="text-[25px] font-bold text-black">ID de socio :</h3>
              <input
                name="idSocio"
                value={formData.idSocio}
                onChange={handleChange}
                className="text-[25px] font-bold text-black bg-[#EEF4FF] rounded-xl px-3 py-1 border border-gray-200 outline-none focus:border-[#3851EE] w-40"
              />
            </div>

            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4 gap-4">
              <span className="text-gray-600 font-bold shrink-0">Fecha de registro</span>
              <input name="fechaRegistro" value={formData.fechaRegistro} onChange={handleChange} type="date" className={`${inputClass} max-w-[200px]`} />
            </div>

            <div className="flex items-center gap-4 mb-6">
              <img src={images.statusIcon} className="w-10 h-10 object-contain" alt="Estatus" />
              <div className="flex-1">
                <span className="block font-bold text-black mb-1">Estatus</span>
                <select name="estatus" value={formData.estatus} onChange={handleChange} className={inputClass}>
                  <option>Activo</option>
                  <option>Suspendido</option>
                  <option>Inactivo</option>
                  <option>Pendiente</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4 gap-4">
              <span className="font-bold text-black shrink-0">Tipo de membresía</span>
              <select name="tipoMembresia" value={formData.tipoMembresia} onChange={handleChange} className={`${inputClass} max-w-[200px]`}>
                <option>Individual</option>
                <option>Familiar</option>
                <option>Estudiante</option>
                <option>VIP</option>
              </select>
            </div>

            <div className="flex justify-between items-center mb-4 gap-4">
              <span className="font-bold text-black shrink-0">Promo ó descuento (%)</span>
              <input
                name="descuento"
                value={formData.descuento}
                onChange={handleChange}
                type="number"
                min="0" max="100"
                className={`${inputClass} max-w-[120px] text-red-500 font-bold`}
              />
            </div>

            <div className="bg-[#D0EEFF] rounded-2xl p-4 flex justify-between items-center mb-6 gap-4">
              <span className="text-xl font-bold text-black shrink-0">Costo mensual</span>
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold text-black">$</span>
                <input
                  name="costoMensual"
                  value={formData.costoMensual}
                  onChange={handleChange}
                  type="number"
                  className="text-xl font-bold text-black bg-white/60 rounded-xl px-3 py-1 border border-blue-200 outline-none focus:border-[#3851EE] w-28 text-right"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4 text-sm">
              <div>
                <label className={labelClass}>Inicio</label>
                <input name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} type="date" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Fin</label>
                <input name="fechaFin" value={formData.fechaFin} onChange={handleChange} type="date" className={inputClass} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-8 shadow-sm">
            <h3 className="text-[25px] font-bold text-black mb-6">Información médica / Extras</h3>

            <div className="space-y-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center gap-2 border-b border-gray-100 pb-4">
                <span className="font-bold text-black md:w-32 shrink-0">Lesiones</span>
                <input name="lesiones" value={formData.lesiones} onChange={handleChange} className={inputClass} placeholder="Describe lesiones..." />
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 border-b border-gray-100 pb-4">
                <span className="font-bold text-black md:w-32 shrink-0">Alergias</span>
                <input name="alergias" value={formData.alergias} onChange={handleChange} className={inputClass} placeholder="Describe alergias..." />
              </div>
            </div>

            <textarea
              name="extras"
              placeholder="Escribe extras aquí..."
              value={formData.extras}
              onChange={handleChange}
              rows={3}
              className="w-full bg-[#D0EEFF] text-black text-lg py-4 px-6 rounded-2xl border-none outline-none mb-6 placeholder-gray-500 resize-none focus:ring-2 focus:ring-[#3851EE]/30 transition"
            />

            <div className="flex justify-between items-center">
              <span className="font-bold text-black text-lg">Huella digital o QR</span>
              <img src={images.fingerprint} className="w-20 h-20 object-contain" alt="Huella" />
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full mt-2">
            <button
              className="w-full bg-[#3851EE] hover:bg-[#2b41cc] text-white text-2xl font-bold py-4 rounded-[24px] shadow-lg active:scale-95 transition-transform"
              onClick={() => navigate("/estado-cuenta")}
            >
              Estado de cuenta
            </button>

            <button
              className="w-full bg-[#21CB62] hover:bg-[#1db556] text-white text-2xl font-bold py-4 rounded-[24px] shadow-lg active:scale-95 transition-transform"
              onClick={() => registrarSocio(formData).then(() => alert("Guardado exitoso")).catch(() => alert("Error al guardar"))}
            >
              Guardar
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}