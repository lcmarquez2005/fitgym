import { Camera, Loader2 } from 'lucide-react';

export const CameraInput = ({ photoPreview, onPhotoChange, errors = {}, uploading }: any) => (
  <div className="flex items-center m-0">
    <label className={`relative w-30 h-20 rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden transition-all ${
      errors?.fotoPerfil ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-indigo-400 bg-white'
    }`}>
      {uploading ? (
        <div className="w-full h-full flex items-center justify-center bg-white/80 absolute inset-0 z-10">
          <Loader2 className="animate-spin text-indigo-500" size={24} />
        </div>
      ) : null}

      {photoPreview ? (
        <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <Camera size={30} className="text-gray-400" />
          <span className="text-[10px] text-gray-500 mt-1 font-bold">SUBIR FOTO</span>
        </div>
      )}
      <input type="file" className="hidden" accept="image/*" onChange={onPhotoChange} disabled={uploading} />
    </label>
  </div>
);