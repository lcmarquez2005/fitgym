import React, { type ChangeEvent } from "react";
import { CreditCard, Calendar, ShieldCheck, User } from "lucide-react";

interface CheckoutFormProps {
  formData: {
    name: string;
    email: string;
    cardNumber: string;
    cvv: string;
    expiry: string;
  };
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ formData, handleChange }) => {
  // Formatear el número de tarjeta con espacios para la visualización del mockup
  const formatCardNumber = (num: string) => {
    const cleaned = num.replace(/\s?/g, '').replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.slice(0, 4).join(' ') : cleaned;
  };

  const displayCardNumber = formData.cardNumber ? formatCardNumber(formData.cardNumber) : "•••• •••• •••• ••••";
  const displayHolder = formData.name ? formData.name.toUpperCase() : "NOMBRE DEL TITULAR";
  const displayExpiry = formData.expiry ? formData.expiry : "MM/AA";
  const displayCvv = formData.cvv ? formData.cvv : "•••";

  return (
    <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-xl shadow-gray-100 flex-1 text-black font-inter border border-gray-100/50">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bakbak uppercase text-black">Detalles de Pago</h2>
          <p className="text-gray-400 text-xs mt-1">Completa los datos para activar tu suscripción de inmediato.</p>
        </div>
        <div className="flex gap-2">
          {/* Tarjetas simuladas aceptadas */}
          <span className="text-[10px] bg-gray-100 px-2.5 py-1 rounded-md font-extrabold text-gray-500 uppercase tracking-wider">Visa</span>
          <span className="text-[10px] bg-gray-100 px-2.5 py-1 rounded-md font-extrabold text-gray-500 uppercase tracking-wider">MC</span>
          <span className="text-[10px] bg-gray-100 px-2.5 py-1 rounded-md font-extrabold text-gray-500 uppercase tracking-wider">Amex</span>
        </div>
      </div>

      {/* --- MOCKUP DE TARJETA DE CRÉDITO --- */}
      <div className="relative w-full max-w-[340px] h-[200px] rounded-3xl bg-gradient-to-br from-[#606DE5] via-indigo-600 to-[#4754cf] text-white p-6 shadow-xl shadow-indigo-100/70 mb-10 overflow-hidden mx-auto md:mx-0 group transition-transform hover:scale-[1.02]">
        {/* Decoraciones de fondo */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-900/20 rounded-full blur-xl pointer-events-none" />

        {/* Chip y NFC */}
        <div className="flex justify-between items-center mb-8">
          <div className="w-10 h-7 rounded-md bg-amber-400/90 border border-amber-300 shadow-inner flex items-center justify-center overflow-hidden">
            {/* Líneas simuladoras del chip */}
            <div className="grid grid-cols-3 gap-0.5 w-full h-full opacity-60 p-0.5">
              <div className="border border-amber-600 rounded-sm"></div>
              <div className="border border-amber-600 rounded-sm"></div>
              <div className="border border-amber-600 rounded-sm"></div>
              <div className="border border-amber-600 rounded-sm"></div>
              <div className="border border-amber-600 rounded-sm"></div>
              <div className="border border-amber-600 rounded-sm"></div>
            </div>
          </div>
          <CreditCard className="text-white/80" size={24} />
        </div>

        {/* Número de Tarjeta */}
        <div className="text-lg md:text-xl font-bold tracking-widest mb-6 font-mono text-white/95">
          {displayCardNumber}
        </div>

        {/* Nombre y Expiración */}
        <div className="flex justify-between items-end mt-auto">
          <div className="truncate max-w-[200px]">
            <span className="text-[9px] uppercase tracking-widest text-indigo-200 block">Titular</span>
            <span className="text-sm font-semibold tracking-wide truncate block">{displayHolder}</span>
          </div>
          <div className="flex gap-4 text-right">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-indigo-200 block">Exp</span>
              <span className="text-sm font-semibold tracking-wide block">{displayExpiry}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-indigo-200 block">CVV</span>
              <span className="text-sm font-semibold tracking-wide block">{displayCvv}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- FORMULARIO --- */}
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1.5">
            <User size={13} className="text-[#606DE5]" /> Nombre del Titular
          </label>
          <input 
            name="name" 
            type="text" 
            value={formData.name}
            placeholder="Juan Pérez" 
            onChange={handleChange} 
            className="p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#606DE5] transition-all font-medium text-sm text-gray-800 placeholder:text-gray-400" 
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email del Socio</label>
          <input 
            name="email" 
            type="email" 
            value={formData.email}
            placeholder="correo@ejemplo.com" 
            onChange={handleChange} 
            className="p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#606DE5] transition-all font-medium text-sm text-gray-800 placeholder:text-gray-400" 
            required
            disabled
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1.5">
            <CreditCard size={13} className="text-[#606DE5]" /> Número de Tarjeta
          </label>
          <input 
            name="cardNumber" 
            type="text" 
            maxLength={19}
            value={formData.cardNumber}
            placeholder="0000 0000 0000 0000" 
            onChange={handleChange} 
            className="p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#606DE5] transition-all font-medium text-sm text-gray-800 placeholder:text-gray-400" 
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-[#606DE5]" /> CVV
          </label>
          <input 
            name="cvv" 
            type="text" 
            maxLength={4}
            value={formData.cvv}
            placeholder="123" 
            onChange={handleChange} 
            className="p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#606DE5] transition-all font-medium text-sm text-gray-800 placeholder:text-gray-400" 
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1.5">
            <Calendar size={13} className="text-[#606DE5]" /> Vencimiento
          </label>
          <input 
            name="expiry" 
            type="text" 
            maxLength={5}
            value={formData.expiry}
            placeholder="MM/AA" 
            onChange={handleChange} 
            className="p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#606DE5] transition-all font-medium text-sm text-gray-800 placeholder:text-gray-400" 
            required
          />
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;

