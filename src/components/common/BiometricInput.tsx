import {  Fingerprint, CheckCircle } from 'lucide-react';

export const BiometricInput = ({  fingerprintStatus, onFingerprintCapture, isCapturing }: any) => (
    <div className="flex items-center m-0">
      <button
        type="button"
        onClick={onFingerprintCapture}
        className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${fingerprintStatus ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'}`}
      >
        {fingerprintStatus ? <CheckCircle size={32} className="text-green-500" /> : <Fingerprint size={32} className={`${isCapturing ? 'animate-pulse text-yellow-500' : 'text-gray-400'}`} />}
        <span className="text-[10px] mt-1 uppercase font-bold">{isCapturing ? 'Escaneando...' : fingerprintStatus ? 'Listo' : 'Capturar'}</span>
      </button>
    </div>
);