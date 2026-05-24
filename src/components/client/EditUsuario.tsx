import React, { useState } from 'react';
import { X, Loader2, CreditCard } from 'lucide-react';
import frame10 from "@assets/frame-10.png";
import { BiometricInput, CameraInput, ProcesarPagoModal } from "@/components";
import { useEditUsuario } from '@hooks/useEditUsuario';
import { type User } from '@services/user.service';

interface EditUsuarioProps {
  user: User;
  onClose: () => void;
  onUserUpdated?: (data: any) => void;
}

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  placeholder?: string;
  error?: string;
  type?: string;
  disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ label, name, value, onChange, placeholder, error, type = "text", disabled }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full p-3 rounded-2xl border-2 transition-all outline-none text-sm font-medium ${
        error ? 'border-red-400 bg-red-50' : 'border-gray-100 focus:border-indigo-500 focus:bg-white bg-gray-50/50'
      }`}
    />
    {error && <p className="text-red-500 text-[10px] font-bold mt-0.5 ml-2 uppercase italic">{error}</p>}
  </div>
);

export const EditUsuario: React.FC<EditUsuarioProps> = ({ user, onClose, onUserUpdated }) => {
  const {
    formData,
    loading,
    uploadingPhoto,
    isCapturingFingerprint,
    errors,
    getImageUrl,
    handleChange,
    handleFingerprintCapture,
    handlePhotoUpload,
    handleSubmit
  } = useEditUsuario({ user, onClose, onUserUpdated });

  const [showPagoModal, setShowPagoModal] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all z-10"
        >
          <X size={24} />
        </button>
        
        <div className="overflow-y-auto p-3 md:p-5">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center space-y-4">
              <img src={frame10} className="w-40 mx-auto transform hover:scale-105 transition-transform" alt="Edit User" />
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-3">
                  <h2 className="text-xl font-bakbak text-black uppercase">Editar Usuario</h2>
                  <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-xl font-bakbak text-lg border-2 border-indigo-100 shadow-sm">
                    #{user.id}
                  </span>
                </div>
                <p className="text-gray-400 font-medium italic">Modifica los datos del integrante</p>
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="flex justify-center gap-4 px-6">
              <button
                type="button"
                onClick={() => setShowPagoModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-green-50 text-green-600 rounded-2xl font-bold hover:bg-green-100 transition-all border border-green-200 shadow-sm"
              >
                <CreditCard size={20} />
                PROCESAR PAGO
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField 
                label="Nombre" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Ej. Luis" 
                error={errors.name}
                disabled={loading}
              />
              <FormField 
                label="Apellidos" 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleChange} 
                placeholder="Ej. Márquez" 
                error={errors.lastName}
                disabled={loading}
              />
              <FormField 
                label="No. Control" 
                name="noControl" 
                value={formData.noControl} 
                onChange={handleChange} 
                placeholder="Ej. 2024001" 
                error={errors.noControl}
                disabled={loading}
              />
              <FormField 
                label="Correo Electrónico" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="ejemplo@fitgym.com" 
                error={errors.email}
                type="email"
                disabled={loading}
              />
              
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Tipo de Usuario</label>
                <select 
                  name="rol" 
                  value={formData.rol}
                  onChange={handleChange}
                  className="w-full p-3 rounded-2xl border-2 border-gray-100 bg-gray-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-sm font-medium"
                  disabled={loading}
                >
                  <option value="SOCIO">Socio (Cliente)</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="COACH">Entrenador (Coach)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-around gap-8 py-4 bg-gray-50 rounded-[32px] border border-gray-100 p-6">
              <BiometricInput
                fingerprintStatus={!!formData.huellaDigital}
                onFingerprintCapture={handleFingerprintCapture}
                isCapturing={isCapturingFingerprint}
              />
              
              <CameraInput
                photoPreview={getImageUrl(formData.fotoPerfil)}
                onPhotoChange={handlePhotoUpload}
                errors={errors}
                uploading={uploadingPhoto}
              />
            </div>
            
            {errors.huellaDigital && (
              <p className="text-red-500 text-[10px] font-bold text-center uppercase italic">{errors.huellaDigital}</p>
            )}

            <button 
              type="submit" 
              disabled={loading || uploadingPhoto}
              className="w-full py-3 bg-[#606DE5] text-white rounded-[26px] font-bakbak text-sm shadow-xl shadow-indigo-100 hover:bg-[#4a55c2] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <Loader2 className="animate-spin" size={24} />
                  Actualizando...
                </span>
              ) : 'Guardar Cambios'}
            </button>
          </form>
        </div>
      </div>

      {showPagoModal && (
        <ProcesarPagoModal 
          socioId={user.id}
          socioNombre={`${user.name} ${user.lastName}`}
          onClose={() => setShowPagoModal(false)}
        />
      )}
    </div>
  );
};
