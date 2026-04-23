// components/client/AltaUsuario.tsx
import { X } from 'lucide-react';
import frame10 from "../../assets/frame-10.png";
import { BiometricInput } from "../BiometricInput";
import { CameraInput } from "../CameraInput";
import { useState } from 'react';
import { UserService, type UserPost } from '../../services/user.service';
import { BASE_URL } from '../../services/api.config'; // 👈 IMPORTAR BASE_URL

export const AltaUsuario = ({ onClose, onUserCreated }: { onClose: () => void, onUserCreated?: (d: any) => void }) => {
  const [formData, setFormData] = useState<UserPost>({
    name: '',
    lastName: '',
    noControl: '',
    fotoPerfil: '',
    huellaDigital: '',
    rol: 'CLIENTE'
  });
  
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false); // 👈 NUEVO: Estado para saber si está subiendo
  const [isCapturingFingerprint, setIsCapturingFingerprint] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  
  // 👇 NUEVO: Función helper para obtener la URL completa de la imagen
  const getImageUrl = (path: string): string => {
    if (!path) return '';
    
    // Si ya es Base64, devolverlo tal cual (para compatibilidad)
    if (path.startsWith('data:image')) {
      return path;
    }
    
    // Si es una URL relativa, construir la URL completa
    if (path.startsWith('/uploads/')) {
      return `${BASE_URL.replace('/api', '')}${path}`;
    }
    
    return path;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};
    
    if (!formData.name.trim()) nuevosErrores.name = 'El nombre es obligatorio';
    if (!formData.lastName.trim()) nuevosErrores.lastName = 'Los apellidos son obligatorios';
    if (!formData.noControl.trim()) nuevosErrores.noControl = 'El número de control es obligatorio';
    if (!formData.huellaDigital) nuevosErrores.huellaDigital = 'Debes capturar la huella digital';
    
    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleFingerprintCapture = async () => {
    setIsCapturingFingerprint(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setFormData(prev => ({
        ...prev,
        huellaDigital: 'FP_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      }));
    } catch (error) {
      console.error('Error capturando huella:', error);
      setErrors(prev => ({ ...prev, huellaDigital: 'Error al capturar huella' }));
    } finally {
      setIsCapturingFingerprint(false);
    }
  };

  // 👇 MODIFICADO: Ahora sube la foto al servidor
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, fotoPerfil: 'La imagen no debe superar 5MB' }));
      return;
    }
    
    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, fotoPerfil: 'Solo se permiten imágenes' }));
      return;
    }
    
    setUploadingPhoto(true);
    
    // 👇 CREAR PREVIEW INMEDIATO (para mostrar mientras se sube)
    const reader = new FileReader();
    reader.onloadend = () => {
      // Guardar temporalmente como Base64 para preview inmediato
      setFormData(prev => ({
        ...prev,
        fotoPerfil: reader.result as string  // Preview temporal
      }));
    };
    reader.readAsDataURL(file);
    
    // 👇 SUBIR AL SERVIDOR
    const formDataFile = new FormData();
    formDataFile.append('file', file);
    
    try {
      const response = await fetch(`${BASE_URL}/users/upload-photo`, {
        method: 'POST',
        body: formDataFile
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al subir la foto');
      }
      
      const data = await response.json();
      
      // 👇 REEMPLAZAR el Base64 temporal por la URL permanente
      setFormData(prev => ({
        ...prev,
        fotoPerfil: data.url  // URL del servidor
      }));
      
      // Limpiar error si existía
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.fotoPerfil;
        return newErrors;
      });
      
    } catch (error: any) {
      console.error('Error subiendo foto:', error);
      setErrors(prev => ({ ...prev, fotoPerfil: error.message }));
      
      // Limpiar el preview si falló
      setFormData(prev => ({
        ...prev,
        fotoPerfil: ''
      }));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }
    
    setLoading(true);
    setMensajeExito(null);

    try {
      console.log('📤 Enviando datos:', formData);
      
      const response = await UserService.create(formData);
      
      if (response.success) {
        setMensajeExito(response.message);
        
        if (onUserCreated) {
          onUserCreated(response.data);
        }
        
        setFormData({
          name: '',
          lastName: '',
          noControl: '',
          fotoPerfil: '',
          huellaDigital: '',
          rol: 'CLIENTE'
        });
        
        setTimeout(() => onClose(), 1500);
      } else {
        setErrors({ submit: response.message });
      }
    } catch (error: any) {
      console.error('❌ Error:', error);
      setErrors({ submit: error.message || 'Error al conectar con el servidor' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative flex flex-col w-[600px] max-h-[90vh] bg-[#f6f8fe] rounded-3xl shadow-2xl overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div className="text-center">
            <img src={frame10} className="w-48 mx-auto" alt="Ilustración" />
            <h2 className="text-3xl font-bakbak mb-2">Usuario Nuevo</h2>
            <p className="text-sm text-gray-500">Completa todos los campos para registrar un nuevo socio</p>
          </div>

          {mensajeExito && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl">
              ✅ {mensajeExito}
            </div>
          )}
          
          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
              ❌ {errors.submit}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-gray-600 ml-1">NOMBRE *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej. Juan"
                className={`w-full p-3 rounded-2xl border-2 transition-all outline-none ${
                  errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
                }`}
                disabled={loading}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-600 ml-1">APELLIDOS *</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Ej. Pérez García"
                className={`w-full p-3 rounded-2xl border-2 transition-all outline-none ${
                  errors.lastName ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
                }`}
                disabled={loading}
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.lastName}</p>}
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-600 ml-1">NO. CONTROL *</label>
              <input
                name="noControl"
                value={formData.noControl}
                onChange={handleChange}
                placeholder="Ej. 23200286"
                className={`w-full p-3 rounded-2xl border-2 transition-all outline-none ${
                  errors.noControl ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
                }`}
                disabled={loading}
              />
              {errors.noControl && <p className="text-red-500 text-xs mt-1 ml-1">{errors.noControl}</p>}
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-600 ml-1">TIPO DE USUARIO *</label>
              <select 
                name="rol" 
                value={formData.rol}
                onChange={handleChange}
                className="w-full p-3 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 transition-all outline-none"
                disabled={loading}
              >
                <option value="CLIENTE">Cliente</option>
                <option value="ADMIN">Administrador</option>
                <option value="COACH">Entrenador</option>
              </select>
            </div>
          </div>

          <div className="flex flex-row justify-around py-2">
            <BiometricInput
              fingerprintStatus={!!formData.huellaDigital}
              onFingerprintCapture={handleFingerprintCapture}
              isCapturing={isCapturingFingerprint}
            />
            
            {/* 👇 PASAMOS LA URL COMPLETA DE LA IMAGEN */}
            <CameraInput
              photoPreview={getImageUrl(formData.fotoPerfil)}
              onPhotoChange={handlePhotoUpload}
              errors={errors}
              uploading={uploadingPhoto}  // 👈 Nuevo prop
            />
          </div>
          
          {errors.huellaDigital && (
            <p className="text-red-500 text-xs text-center">{errors.huellaDigital}</p>
          )}

          <button 
            type="submit" 
            disabled={loading || uploadingPhoto}
            className="w-full py-3 bg-[#606de5] text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                GUARDANDO...
              </span>
            ) : 'REGISTRAR SOCIO'}
          </button>
        </form>
      </div>
    </div>
  );
};