import { useState, type ChangeEvent } from "react";
import Footer from "@layout/Footer";
import Header from "@layout/Header";
import type { SocioFormData, Socio } from "./types";
import SocioStyles from "./SocioStyles";
import SocioSearchBar from "./SocioSearchBar";
import SocioProfileCard from "./SocioProfileCard";
import SocioMembershipCard from "./SocioMembershipCard";
import SocioMedicalCard from "./SocioMedicalCard";
import SocioActions from "./SocioActions";
import { SocioService } from "@services/socio.service";

export default function SocioPage() {
  const images = {
    userPhoto: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/bp4d6fgu_expires_30_days.png",
    statusIcon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/7rubqqgd_expires_30_days.png",
    fingerprint: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Umrd8oNQvi/z8h8ojz9_expires_30_days.png",
  };

  const [foto, setFoto] = useState(images.userPhoto);
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState<Socio[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [sinResultados, setSinResultados] = useState(false);
  const [socioSeleccionadoId, setSocioSeleccionadoId] = useState<string | null>(null);
  const [editable, setEditable] = useState(true);

  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (archivo) {
      const url = URL.createObjectURL(archivo);
      setFoto(url);
    }
  };

  const [formData, setFormData] = useState<SocioFormData>({
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      const lista = await SocioService.buscar(busqueda);
      if (lista.length === 0) setSinResultados(true);
      else setResultados(lista);
    } catch (err) {
      console.error("Error al buscar:", err);
    } finally {
      setBuscando(false);
    }
  };

  const seleccionarSocio = (socio: Socio) => {
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
      descuento: socio.descuento?.toString() ?? "0",
      costoMensual: socio.costoMensual?.toString() ?? "0",
      fechaInicio: socio.fechaInicio ?? "",
      fechaFin: socio.fechaFin ?? "",
      lesiones: socio.lesiones ?? "Ninguna",
      alergias: socio.alergias ?? "Ninguna",
      extras: socio.extras ?? "",
    });
    if (socio.foto) setFoto(socio.foto);
    setSocioSeleccionadoId(socio.id ?? null);
    setEditable(false);
    setResultados([]);
    setBusqueda("");
    setSinResultados(false);
  };

  const registrarSocio = async (datos: SocioFormData) => {
    return await SocioService.crear(datos);
  };

  const actualizarSocio = async (id: string, datos: SocioFormData) => {
    return await SocioService.actualizar(id, datos);
  };

  const eliminarSocio = async (id: string) => {
    return await SocioService.eliminar(id);
  };

  const inputBase = `w-full text-sm font-medium px-4 py-3 rounded-xl border outline-none transition-all duration-200`;
  const inputEnabled = `bg-white border-slate-200 text-slate-800 placeholder-slate-400
    focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white`;
  const inputDisabled = `bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed`;
  const inputClass = `${inputBase} ${editable ? inputEnabled : inputDisabled}`;

  const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5";

  const estatusColors: Record<string, string> = {
    Activo: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    Suspendido: "bg-amber-50 text-amber-600 border border-amber-200",
    Inactivo: "bg-slate-100 text-slate-500 border border-slate-200",
    Pendiente: "bg-blue-50 text-blue-600 border border-blue-200",
  };

  return (
    <>
      <SocioStyles />

      <div className="socio-root">
        <Header />

        <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 16px 48px" }}>
          <SocioSearchBar
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            buscando={buscando}
            sinResultados={sinResultados}
            resultados={resultados}
            buscarSocio={buscarSocio}
            seleccionarSocio={seleccionarSocio}
            setSinResultados={setSinResultados}
            setResultados={setResultados}
            estatusColors={estatusColors}
          />

          <SocioProfileCard
            formData={formData}
            handleChange={handleChange}
            editable={editable}
            setEditable={setEditable}
            foto={foto}
            handleFotoChange={handleFotoChange}
            inputClass={inputClass}
            labelClass={labelClass}
          />

          <SocioMembershipCard
            formData={formData}
            handleChange={handleChange}
            editable={editable}
            inputClass={inputClass}
            labelClass={labelClass}
          />

          <SocioMedicalCard
            formData={formData}
            handleChange={handleChange}
            editable={editable}
            inputClass={inputClass}
            labelClass={labelClass}
            fingerprintImg={images.fingerprint}
          />

          <SocioActions
            formData={formData}
            socioSeleccionadoId={socioSeleccionadoId}
            editable={editable}
            setEditable={setEditable}
            setSocioSeleccionadoId={setSocioSeleccionadoId}
            registrarSocio={registrarSocio}
            actualizarSocio={actualizarSocio}
            eliminarSocio={eliminarSocio}
          />
        </div>

        <Footer />
      </div>
    </>
  );
}
