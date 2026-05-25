import React from "react";
import { Loader2, ArrowRight } from "lucide-react";

interface CheckoutSummaryProps {
  monto: number;
  planName: string;
  loading: boolean;
  handlePay: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ monto, planName, loading, handlePay }) => {
  const subtotal = monto;
  // Tax 16% IVA included
  const tax = subtotal * 0.16;
  const total = subtotal;

  return (
    <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-xl shadow-gray-100 w-full lg:w-[400px] h-fit text-black border border-gray-100/50 font-inter">
      <h3 className="text-xl font-bakbak uppercase text-black mb-6">Resumen de Compra</h3>
      
      <div className="mb-6 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/30">
        <span className="text-[10px] font-bold text-[#606DE5] uppercase tracking-widest block mb-1">Membresía Seleccionada</span>
        <span className="text-lg font-bold text-gray-800 block truncate">{planName}</span>
      </div>

      <div className="space-y-4 mb-8 pt-2">
        <div className="flex justify-between text-gray-500 text-sm font-semibold">
          <span>Subtotal (sin IVA)</span>
          <span>MXN {(subtotal - tax).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-500 text-sm font-semibold">
          <span>IVA (16%)</span>
          <span>MXN {tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-dashed border-gray-150 pt-4 flex justify-between font-bakbak text-2xl text-black">
          <span className="uppercase">Total</span>
          <span className="text-[#606DE5]">MXN {total.toFixed(2)}</span>
        </div>
      </div>
      
      <button 
        onClick={handlePay} 
        disabled={loading}
        className="w-full bg-[#606DE5] hover:bg-[#4d5bc4] text-white font-bold py-4 rounded-2xl transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-150 cursor-pointer text-base"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            PROCESANDO PAGO...
          </>
        ) : (
          <>
            PAGAR MEMBRESÍA
            <ArrowRight size={18} />
          </>
        )}
      </button>

      <p className="text-[10px] text-gray-400 text-center mt-4 leading-relaxed">
        Al hacer clic en pagar, aceptas los términos de servicio y políticas de cancelación de FitGym.
      </p>
    </div>
  );
};

export default CheckoutSummary;

