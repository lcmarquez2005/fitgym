import { Camera } from 'lucide-react';

export const CameraInput = ({ photoPreview, onPhotoChange , errors }: any) => (
    <div className="flex items-center m-0">
      <label className={`relative w-30 h-20 rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden transition-all ${errors.photo ? 'border-red-500' : 'border-gray-300 hover:border-blue-500'}`}>
        {photoPreview ? (
          <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
            <Camera size={30} className="text-gray-400" />
            <span className="text-[10px] text-gray-500 mt-1">SUBIR FOTO</span>
          </div>
        )}
        <input type="file" className="hidden" accept="image/*" onChange={onPhotoChange} />
      </label>
    </div>
);