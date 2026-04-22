import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate, useLocation } from "react-router-dom"; // Importamos useLocation

const CheckoutPage = () => {
  const navigate = useNavigate(); 
  const location = useLocation(); // Inicializamos useLocation para leer los datos que nos enviaron

  // Extraemos el nombre del plan y el costo desde el "state" de la ruta
  // Ponemos valores por defecto por si alguien entra directo a la URL sin elegir plan
  const { nombrePlan, costo } = location.state || { 
    nombrePlan: "Plan no seleccionado", 
    costo: "MXN 0.00" 
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cardNumber: "",
    cvv: "",
    expiry: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePay = (e) => {
    e.preventDefault(); 
    // Aquí podrías validar que los campos no estén vacíos
    alert("¡Pago procesado con éxito!");
    
    // Navegamos al ticket, pero ahora le mandamos los datos de la compra
    // para que el ticket sepa qué imprimir
    navigate('/ticket', { 
      state: { 
        nombrePlan: nombrePlan, 
        costo: costo, 
        cliente: formData.name || "Cliente General" 
      } 
    }); 
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F8FE]">
      <Navbar />
      <div className="container mx-auto px-4 py-10 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          
          {/* Formulario */}
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

          {/* Resumen Lateral */}
          <div className="bg-white p-8 rounded-3xl shadow-sm w-full lg:w-[400px] h-fit">
            <h3 className="text-xl font-bold mb-6 text-black">Resumen</h3>
            <div className="space-y-4 mb-6">
              
              {/* Aquí mostramos el plan que el usuario eligió */}
              <div className="flex justify-between text-gray-700 font-medium items-center">
                <span>Plan Seleccionado</span>
                <span className="text-right text-[#606DE5] font-bold text-sm max-w-[150px] leading-tight">
                  {nombrePlan}
                </span>
              </div>
              
              {/* Reemplazamos los valores fijos por el costo dinámico */}
              <div className="border-t pt-4 flex justify-between font-bold text-xl text-black items-end">
                <span>Total</span>
                <span className="text-right">{costo}</span>
              </div>

            </div>
            <button onClick={handlePay} className="w-full bg-[#606DE5] text-white font-bold py-4 rounded-2xl hover:bg-[#4a55c2] transition">Pagar Ahora</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;