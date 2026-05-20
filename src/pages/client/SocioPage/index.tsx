import { useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import Footer from "@layout/Footer";
import Header from "@layout/Header";
import type { SocioFormData, Socio } from "./types";
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

  const initialFormData: SocioFormData = {
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
    descuento: "0",
    costoMensual: "0",
    fechaInicio: "",
    fechaFin: "",
    lesiones: "Ninguna",
    alergias: "Ninguna",
    extras: "",
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

  const [formData, setFormData] = useState<SocioFormData>(initialFormData);

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
      toast.error("Error al buscar socios. Inténtalo de nuevo.");
    } finally {
      setBuscando(false);
    }
  };

  const seleccionarSocio = (socio: Socio) => {
    // The backend sends a computed `nombreCompleto` and all fields match camelCase.
    // We also convert numbers to strings for the input fields.

    const newFormData: SocioFormData = {
      ...initialFormData, // Start with a clean slate to remove old data
      ...socio, // Spread all properties from the socio object
      id: socio.id,
      descuento: socio.descuento?.toString() ?? "0",
      costoMensual: socio.costoMensual?.toString() ?? "0",
    };

    setFormData(newFormData);
    if (socio.foto) setFoto(socio.foto); // Use 'foto' from the socio object
    setSocioSeleccionadoId(socio.id); // 'id' from socio is now required
    setEditable(false);
    setResultados([]);
    setBusqueda("");
    setSinResultados(false);
  };

  const limpiarFormulario = () => {
    setSocioSeleccionadoId(null);
    setFormData(initialFormData);
    setFoto(images.userPhoto);
    setEditable(true);
    setBusqueda("");
    setResultados([]);
    setSinResultados(false);
    toast.info("Formulario listo para registrar un nuevo socio.");
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
      {/* SocioStyles se elimina ya que sus estilos se migraron a Tailwind o clases de componente */}
      <div className="min-h-screen bg-slate-100 font-sans">
        <Header />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-800 font-syne">Gestión de Socios</h1>
            <p className="text-slate-500">Busca, crea, edita y gestiona la información de los socios.</p>
          </div>

          <div className="w-full max-w-2xl mx-auto mb-8">
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
          </div>

          {/* Layout de 2 columnas: 2/3 para info, 1/3 para acciones */}
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
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
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <SocioActions
                  formData={formData}
                  socioSeleccionadoId={socioSeleccionadoId}
                  editable={editable}
                  setEditable={setEditable}
                  registrarSocio={registrarSocio}
                  actualizarSocio={actualizarSocio}
                  eliminarSocio={eliminarSocio}
                  limpiarFormulario={limpiarFormulario}
                />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
