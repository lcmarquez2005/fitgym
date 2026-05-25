import { useState, useEffect, type ChangeEvent } from "react";
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
import { UserService } from "@services/user.service";
import { UserPlus, UserCircle, Activity, CreditCard, Users } from 'lucide-react';
import { GenerarDatosPrueba } from "@/components";
import peopleImage from '@assets/people.png';

export default function SocioPage() {
  const images = {
    userPhoto: peopleImage,
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
    fechaRegistro: new Date().toISOString().split('T')[0],
    estatus: "ACTIVO",
    tipoMembresia: "MENSUAL",
    descuento: "0",
    costoMensual: "500",
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    lesiones: "Ninguna",
    alergias: "Ninguna",
    extras: "",
    foto: "",
    huellaDigital: "",
  };

  const [activeTab, setActiveTab] = useState<'perfil' | 'membresia' | 'medico'>('perfil');
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState<Socio[]>([]);
  const [allSocios, setAllSocios] = useState<Socio[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sinResultados, setSinResultados] = useState(false);
  const [socioSeleccionadoId, setSocioSeleccionadoId] = useState<string | null>(null);
  const [editable, setEditable] = useState(true);
  const [formData, setFormData] = useState<SocioFormData>(initialFormData);
  
  // New states for biometrics and photo upload
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isCapturingFingerprint, setIsCapturingFingerprint] = useState(false);

  // Helper to generate the next logical Socio ID
  const generateNextId = (socios: Socio[]) => {
    if (socios.length === 0) return "00001";
    
    // Extract numbers from existing idSocio values
    const numericIds = socios
      .map(s => {
        const match = s.idSocio?.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      })
      .filter(n => n > 0);
    
    const maxId = numericIds.length > 0 ? Math.max(...numericIds) : socios.length;
    return (maxId + 1).toString().padStart(5, '0');
  };

  // Carga inicial de todos los socios
  useEffect(() => {
    loadAllSocios();
  }, []);

  const loadAllSocios = async () => {
    setLoading(true);
    try {
      const data = await SocioService.getAll();
      console.log("SocioPage: Socios cargados", data);
      setAllSocios(data);
      setResultados(data);
      
      // If we are currently in "New" mode (no socio selected), update the ID
      if (!socioSeleccionadoId) {
        const nextId = generateNextId(data);
        setFormData(prev => ({ ...prev, idSocio: nextId }));
      }
    } catch (err) {
      console.error("SocioPage: Error cargando socios", err);
      toast.error("Error al cargar la lista de socios");
    } finally {
      setLoading(false);
    }
  };

  const handleFotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    if (archivo.size > 5 * 1024 * 1024) {
      toast.warning('La imagen excede el límite de 5MB');
      return;
    }

    setUploadingPhoto(true);
    
    try {
      const data = await UserService.uploadPhoto(archivo);
      setFormData(prev => ({ ...prev, foto: data.url }));
      toast.success('Foto subida exitosamente');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Error al subir la foto');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleFingerprintCapture = async () => {
    if (!editable) return;
    setIsCapturingFingerprint(true);
    try {
      // Simulación de captura (igual que en AltaUsuario)
      await new Promise(resolve => setTimeout(resolve, 1500));
      const fingerprintId = `FP_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      setFormData(prev => ({
        ...prev,
        huellaDigital: fingerprintId
      }));
      toast.success('Huella digital capturada correctamente');
    } catch (error) {
      console.error('Fingerprint error:', error);
      toast.error('Error al capturar la huella');
    } finally {
      setIsCapturingFingerprint(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editable) return;
    const { name, value } = e.target;
    // Don't allow manual change of idSocio or fechaRegistro
    if (name === "idSocio" || name === "fechaRegistro") return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buscarSocio = async () => {
    if (!busqueda.trim()) {
      setResultados(allSocios);
      setSinResultados(false);
      return;
    }
    setBuscando(true);
    setSinResultados(false);
    try {
      const lista = await SocioService.buscar(busqueda);
      setResultados(lista);
      if (lista.length === 0) setSinResultados(true);
    } catch (err) {
      toast.error("Error al buscar socios. Inténtalo de nuevo.");
    } finally {
      setBuscando(false);
    }
  };

  const seleccionarSocio = (socio: Socio) => {
    const newFormData: SocioFormData = {
      ...initialFormData,
      ...socio,
      id: socio.id,
      idSocio: socio.idSocio || socio.noControl || "", // Ensure we have the ID
      descuento: socio.descuento?.toString() ?? "0",
      costoMensual: socio.costoMensual?.toString() ?? "0",
      foto: peopleImage, // Hardcode as requested
    };

    setFormData(newFormData);
    setSocioSeleccionadoId(socio.id);
    setEditable(false);
    setActiveTab('perfil');
  };

  const limpiarFormulario = () => {
    setSocioSeleccionadoId(null);
    const nextId = generateNextId(allSocios);
    setFormData({ 
      ...initialFormData, 
      idSocio: nextId,
      fechaRegistro: new Date().toISOString().split('T')[0]
    });
    setEditable(true);
    setBusqueda("");
    setResultados(allSocios);
    setSinResultados(false);
    setActiveTab('perfil');
    toast.info("Formulario listo para registrar un nuevo socio.");
  };

  const registrarSocio = async (datos: SocioFormData) => {
    const res = await SocioService.crear(datos);
    if (res.success) loadAllSocios();
    return res;
  };

  const actualizarSocio = async (id: string, datos: SocioFormData) => {
    const res = await SocioService.actualizar(id, datos);
    if (res.success) loadAllSocios();
    return res;
  };

  const eliminarSocio = async (id: string) => {
    const res = await SocioService.eliminar(id);
    if (res.success) loadAllSocios();
    return res;
  };

  const inputBase = `w-full text-sm font-medium px-4 py-3 rounded-xl border outline-none transition-all duration-200`;
  const inputEnabled = `bg-white border-slate-200 text-slate-800 placeholder-slate-400
    focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white`;
  const inputDisabled = `bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed`;
  const inputClass = `${inputBase} ${editable ? inputEnabled : inputDisabled}`;
  const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bakbak text-black uppercase tracking-tight text-[#606DE5]">Gestión de Socios</h1>
            <p className="text-gray-500 font-medium italic">Administra, registra y controla el acceso de los miembros</p>
          </div>
          
          <button 
            onClick={limpiarFormulario}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl font-bakbak hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-gray-200"
          >
            <UserPlus size={20} />
            NUEVO REGISTRO
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Panel Izquierdo: Buscador y Lista */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col gap-6">
              <SocioSearchBar
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                buscando={buscando}
                sinResultados={sinResultados}
                buscarSocio={buscarSocio}
                setSinResultados={setSinResultados}
                setResultados={setResultados}
              />

              {/* Lista Persistente de Socios */}
              <div className="flex flex-col gap-2 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex justify-between items-center px-2 mb-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Socios Registrados</h3>
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {resultados.length}
                  </span>
                </div>

                {loading ? (
                   <div className="flex flex-col items-center py-10 gap-2">
                     <div className="w-8 h-8 border-4 border-gray-100 border-t-indigo-500 rounded-full animate-spin" />
                     <span className="text-[10px] font-bold text-gray-400 uppercase">Cargando Socios...</span>
                   </div>
                ) : resultados.length === 0 ? (
                  <div className="flex flex-col items-center py-10 text-gray-300 gap-3">
                    <Users size={40} className="opacity-20" />
                    <p className="italic text-sm text-center px-4">No se encontraron socios con los filtros actuales</p>
                  </div>
                ) : (
                  resultados.map((socio) => (
                    <button
                      key={socio.id}
                      onClick={() => seleccionarSocio(socio)}
                      className={`flex items-center gap-4 p-3 rounded-2xl transition-all text-left group ${socioSeleccionadoId === socio.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'hover:bg-slate-50 bg-white border border-transparent'}`}
                    >
                      <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${socioSeleccionadoId === socio.id ? 'border-white/40' : 'border-gray-100'}`}>
                        <img 
                          src={peopleImage} 
                          className="w-full h-full object-cover" 
                          alt={socio.nombreCompleto} 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-sm truncate ${socioSeleccionadoId === socio.id ? 'text-white' : 'text-gray-800'}`}>
                          {socio.nombreCompleto}
                        </p>
                        <p className={`text-[11px] truncate ${socioSeleccionadoId === socio.id ? 'text-indigo-100' : 'text-gray-400'}`}>
                          ID: {socio.idSocio}
                        </p>
                      </div>
                      <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${socio.estatus === 'ACTIVO' ? 'bg-green-400 ring-4 ring-green-400/20' : 'bg-red-400 ring-4 ring-red-400/20'}`} title={socio.estatus} />
                    </button>
                  ))
                )}
              </div>
            </div>

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

            <GenerarDatosPrueba />
          </div>

          {/* Panel Derecho: Detalles (Tabs) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Tabs Navigation */}
            <div className="flex bg-white p-2 rounded-2xl border border-gray-100 shadow-sm gap-2">
              <button
                onClick={() => setActiveTab('perfil')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'perfil' ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                <UserCircle size={18} />
                PERFIL
              </button>
              <button
                onClick={() => setActiveTab('membresia')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'membresia' ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                <CreditCard size={18} />
                MEMBRESÍA
              </button>
              <button
                onClick={() => setActiveTab('medico')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'medico' ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                <Activity size={18} />
                MÉDICO
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'perfil' && (
                <SocioProfileCard
                  formData={formData}
                  handleChange={handleChange}
                  editable={editable}
                  setEditable={setEditable}
                  inputClass={inputClass}
                  labelClass={labelClass}
                />
              )}
              {activeTab === 'membresia' && (
                <SocioMembershipCard
                  formData={formData}
                  handleChange={handleChange}
                  editable={editable}
                  inputClass={inputClass}
                  labelClass={labelClass}
                />
              )}
              {activeTab === 'medico' && (
                <SocioMedicalCard
                  formData={formData}
                  handleChange={handleChange}
                  editable={editable}
                  inputClass={inputClass}
                  labelClass={labelClass}
                  fingerprintImg={images.fingerprint}
                  isCapturingFingerprint={isCapturingFingerprint}
                  onFingerprintCapture={handleFingerprintCapture}
                  uploadingPhoto={uploadingPhoto}
                  onPhotoChange={handleFotoChange}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
