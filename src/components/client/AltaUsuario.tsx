// components/client/AltaUsuario.tsx
import { useState, type JSX } from "react";
import { 
  X, 
  Fingerprint, 
  CheckCircle, 
  Camera,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import frame10 from "../../assets/frame-10.png";


interface AltaUsuarioProps {
  onClose: () => void;
  onUserCreated?: (userData: any) => void;
}

export const AltaUsuario = ({ onClose, onUserCreated }: AltaUsuarioProps): JSX.Element => {
  const [username, setUsername] = useState("");
  const [membershipMonths, setMembershipMonths] = useState(1);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [fingerprintCaptured, setFingerprintCaptured] = useState(false);
  const [isCapturingFingerprint, setIsCapturingFingerprint] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (errors.username) {
      setErrors({...errors, username: ''});
    }
  };

  const handleIncrementMonths = () => {
    setMembershipMonths((prev) => prev + 1);
  };

  const handleDecrementMonths = () => {
    setMembershipMonths((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      if (errors.photo) {
        setErrors({...errors, photo: ''});
      }
    }
  };

  const handleFingerprintCapture = () => {
    setIsCapturingFingerprint(true);
    
    setTimeout(() => {
      setFingerprintCaptured(true);
      setIsCapturingFingerprint(false);
      if (errors.fingerprint) {
        setErrors({...errors, fingerprint: ''});
      }
    }, 2000);
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }
    
    if (!photoFile) {
      newErrors.photo = 'La foto del usuario es requerida';
    }
    
    if (!fingerprintCaptured) {
      newErrors.fingerprint = 'La huella digital es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      const userData = {
        username,
        membershipMonths,
        photoFile,
        fingerprintCaptured,
        fechaRegistro: new Date().toISOString()
      };
      
      console.log('Usuario creado:', userData);
      onUserCreated?.(userData);
      onClose();
    }
  };

  return (
    <>
      {/* Overlay con blur */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal flotante */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="flex flex-col w-[642px] max-h-[90vh] overflow-y-auto bg-[#f6f8fe] rounded-3xl shadow-2xl animate-fadeIn">
          
          {/* Header del modal */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bakbak text-xl">FG</span>
              </div>
              <h1 className="font-bakbak text-black text-[29px]">
                FITGYM
              </h1>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-600 hover:text-black"
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>
          </div>

          {/* Contenido principal */}
          <div className="p-8">
            <div className="flex flex-col items-center gap-4 relative self-stretch w-full">
              <img
                className="relative w-[350px] h-[249.86px]"
                alt="Ilustración de usuario levantando pesas"
                src={frame10}
              />

              <h2 className="relative w-fit [font-family:'Bakbak_One-Regular',Helvetica] font-normal text-black text-[37px] tracking-[0.50px] leading-[normal]">
                Usuario Nuevo
              </h2>

              <p className="text-gray-500 font-inter text-[18px] text-center max-w-[400px] mt-2">
                Captura la foto y huella digital del nuevo miembro
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Nombre de Usuario */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="Ej: Juan Pérez"
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:border-blue-500 transition-colors font-inter text-lg`}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              {/* Área de Foto y Huella */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Datos biométricos
                </label>
                <div className="grid grid-cols-2 gap-6">
                  {/* Área de Foto */}
                  <div className="flex flex-col items-center">
                    <div className="text-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Foto</span>
                    </div>
                    <label
                      htmlFor="photo-upload"
                      className={`relative w-32 h-32 rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden
                        ${photoPreview ? 'border-green-500' : 'border-gray-300 hover:border-blue-500'}
                        ${errors.photo ? 'border-red-500' : ''}
                        transition-all group`}
                    >
                      {photoPreview ? (
                        <img 
                          src={photoPreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 group-hover:bg-gray-100">
                          <Camera size={32} className="text-gray-400 group-hover:text-gray-600" />
                          <span className="text-xs text-gray-500 mt-1">Subir foto</span>
                        </div>
                      )}
                      <input
                        type="file"
                        id="photo-upload"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Área de Huella */}
                  <div className="flex flex-col items-center">
                    <div className="text-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Huella digital</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleFingerprintCapture}
                      disabled={isCapturingFingerprint || fingerprintCaptured}
                      className={`relative w-32 h-32 rounded-2xl border-2 flex flex-col items-center justify-center
                        ${fingerprintCaptured 
                          ? 'border-green-500 bg-green-50' 
                          : isCapturingFingerprint
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-gray-300 hover:border-blue-500 bg-gray-50'
                        }
                        ${errors.fingerprint ? 'border-red-500' : ''}
                        transition-all disabled:opacity-50`}
                    >
                      {fingerprintCaptured ? (
                        <>
                          <CheckCircle size={48} className="text-green-500" />
                          <span className="text-xs text-green-600 mt-1">Capturada</span>
                        </>
                      ) : isCapturingFingerprint ? (
                        <>
                          <Fingerprint size={48} className="text-yellow-600 animate-pulse" />
                          <span className="text-xs text-yellow-600 mt-1">Escaneando...</span>
                        </>
                      ) : (
                        <>
                          <Fingerprint size={48} className="text-gray-400" />
                          <span className="text-xs text-gray-500 mt-1">Capturar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Mensajes de error */}
                {errors.photo && (
                  <p className="text-red-500 text-sm mt-2 text-center">{errors.photo}</p>
                )}
                {errors.fingerprint && !errors.photo && (
                  <p className="text-red-500 text-sm mt-2 text-center">{errors.fingerprint}</p>
                )}
              </div>

              {/* Selector de Mensualidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Duración de membresía
                </label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={handleDecrementMonths}
                    disabled={membershipMonths <= 1}
                    className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronDown size={24} />
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-black text-white px-6 py-3 rounded-xl font-semibold text-xl">
                      {membershipMonths}
                    </div>
                    <span className="text-gray-600 font-medium">mes(es)</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleIncrementMonths}
                    className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    <ChevronUp size={24} />
                  </button>
                </div>
              </div>

              {/* Botón de Crear Usuario */}
              <button
                type="submit"
                className="w-full h-20 bg-[#606de5] hover:bg-[#5058cc] text-white rounded-2xl font-semibold text-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                Crear Usuario Nuevo
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Estilos para animación */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};