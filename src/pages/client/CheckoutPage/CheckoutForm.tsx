import React, { type ChangeEvent } from "react";

interface CheckoutFormProps {
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ handleChange }) => {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm flex-1 text-black font-sans">
      <h2 className="text-2xl font-bold mb-6">Información de Pago</h2>
      <form className="flex flex-col gap-5">
        <div>
          <label className="block mb-2 font-bold">Nombre del Titular</label>
          <input name="name" type="text" placeholder="Juan Pérez" onChange={handleChange} className="w-full bg-gray-50 text-black border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block mb-2 font-bold">Email</label>
          <input name="email" type="email" placeholder="correo@ejemplo.com" onChange={handleChange} className="w-full bg-gray-50 text-black border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block mb-2 font-bold">Número de Tarjeta</label>
          <input name="cardNumber" type="text" placeholder="0000 0000 0000 0000" onChange={handleChange} className="w-full bg-gray-50 text-black border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-2 font-bold">CVV</label>
            <input name="cvv" type="text" placeholder="123" onChange={handleChange} className="w-full bg-gray-50 text-black border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-bold">Vencimiento</label>
            <input name="expiry" type="text" placeholder="MM/AA" onChange={handleChange} className="w-full bg-gray-50 text-black border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
