import React from "react";

interface CheckoutSummaryProps {
  handlePay: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ handlePay }) => {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm w-full lg:w-[400px] h-fit">
      <h3 className="text-xl font-bold mb-6 text-black">Resumen</h3>
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-700 font-medium"><span>Subtotal</span><span>MXN 728.00</span></div>
        <div className="flex justify-between text-gray-700 font-medium"><span>Tax 10%</span><span>MXN 72.00</span></div>
        <div className="border-t pt-4 flex justify-between font-bold text-xl text-black"><span>Total</span><span>MXN 800.00</span></div>
      </div>
      <button onClick={handlePay} className="w-full bg-[#606DE5] text-white font-bold py-4 rounded-2xl hover:bg-[#4a55c2] transition">
        Pagar Ahora
      </button>
    </div>
  );
};

export default CheckoutSummary;
