// components/client/AltaUsuario.tsx
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import frame10 from "../../assets/frame-10.png";
import { BiometricInput } from "../BiometricInput";
import { CameraInput } from "../CameraInput";
import { useState } from 'react';
import  { UserService, type UserPost } from '../../services/user.service';

export const AltaUsuario = ({ onClose, onUserCreated }: { onClose: () => void, onUserCreated?: (d: any) => void }) => {
  const [formData, setFormData] = useState<UserPost>({
    name: '',
    lastName: '',
    noControl: '',
    fotoPerfil: '',
    huellaDigital: '',
    rol: 'CLIENTE' // Valor por defecto
  });
  const [counter, setCounter] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isCapturingFingerprint, setIsCapturingFingerprint] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Manejador de cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFingerprintCapture = async () => {
    setIsCapturingFingerprint(true);
    try {
      // Simular captura de huella (reemplazar con API real)
      await new Promise(resolve => setTimeout(resolve, 2000));
      setFormData({
        ...formData,
        huellaDigital: 'huella_capturada_' + Date.now()
      });
    } catch (error) {
      console.error('Error capturando huella:', error);
    } finally {
      setIsCapturingFingerprint(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          fotoPerfil: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await UserService.create(formData);
      alert(response.message); // "Usuario guardado con éxito"
      // Aquí podrías limpiar el formulario o redirigir
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative flex flex-col w-[600px] max-h-[100vh] bg-[#f6f8fe] rounded-3xl shadow-2xl overflow-y-auto animate-in fade-in zoom-in duration-300">
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div className="text-center">
            <img src={frame10} className="w-48 mx-auto " alt="Ilustración" />
            <h2 className="text-3xl font-bakbak mb-0">Usuario Nuevo</h2>
          </div>

          {/* Nombre de Usuario */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">NOMBRE </label>
            <input
              name="name"
              onChange={handleChange}
              placeholder="Ej. Marquez"
              className={`w-full p-2 rounded-2xl border-2 transition-all outline-none ${errors.username ? 'border-red-400' : 'border-gray-200 focus:border-indigo-500'}`}
              required
            />

            <label className="text-sm font-semibold text-gray-600 ml-1">APELLIDOS </label>
            <input
              name="lastName"
              onChange={handleChange}
              placeholder="Ej. Marquez"
              className={`w-full p-2 rounded-2xl border-2 transition-all outline-none ${errors.username ? 'border-red-400' : 'border-gray-200 focus:border-indigo-500'}`}
              required
            />
            <label className="text-sm font-semibold text-gray-600 ml-1">No. Control </label>
            <input
              name="noControl"
              onChange={handleChange}
              placeholder="Ej. 23200286"
              className={`w-full p-2 rounded-2xl border-2 transition-all outline-none ${errors.username ? 'border-red-400' : 'border-gray-200 focus:border-indigo-500'}`}
              required
            />
            <label className="text-sm font-semibold text-gray-600 ml-1">Tipo Usuario </label>
            <select name="rol" onChange={handleChange} 
              className={`w-full p-2 rounded-2xl border-2 transition-all outline-none ${errors.username ? 'border-red-400' : 'border-gray-200 focus:border-indigo-500'}`}>
              <option value="CLIENTE">Cliente</option>
              <option value="ADMIN">Administrador</option>
              <option value="COACH">Entrenador</option>
            </select>
          </div>

          <div className='flex flex-row justify-around'>
            <div className='flex flex-row gap-5'>

              <BiometricInput
                fingerprintStatus={!!formData.huellaDigital}
                onFingerprintCapture={handleFingerprintCapture}
                isCapturing={isCapturingFingerprint}
              />

              <CameraInput
                photoPreview={formData.fotoPerfil}
                onPhotoChange={handlePhotoUpload}
                errors={errors}
              />
            </div>

            {/* Selector de Membresía */}
            {/* <div className="flex flex-col items-center pl-2 gap-2">
              <span className="text-sm font-semibold text-gray-600">DURACIÓN (MESES)</span>
              <div className="flex items-center gap-6">
                <button type="button" onClick={() => setCounter(Math.max(1, counter - 1))} className="p-3 bg-white shadow-sm rounded-full hover:bg-gray-100"><ChevronDown /></button>
                <span className="text-lg font-bold text-center">{counter}</span>
                <button type="button" onClick={() => setCounter(counter + 1)} className="p-3 bg-white shadow-sm rounded-full hover:bg-gray-100"><ChevronUp /></button>
              </div>
            </div> */}

          </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-2 bg-[#606de5] text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
      >
        {loading ? 'Guardando...' : 'REGISTRAR SOCIO'}
      </button>
        </form>
      </div>
    </div>
  );
};