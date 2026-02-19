import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";

const TicketPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F8FE]">
      <Navbar />
      <div className="flex flex-col items-center py-12 px-4 flex-grow">
        <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-2xl flex flex-col items-center text-black">
          
          <div className="bg-blue-50 p-4 rounded-full mb-6">
            <span className="text-5xl text-blue-600">✓</span>
          </div>

          <h2 className="text-3xl font-bold mb-2">¡Suscripción Exitosa!</h2>
          <p className="text-gray-500 mb-10">Tu ticket digital ha sido generado.</p>

          <div className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-6 mb-8">
            <div className="flex justify-between mb-4 border-b pb-2">
              <span className="text-gray-500 uppercase text-xs font-bold tracking-widest">ID Ticket</span>
              <span className="font-bold text-blue-600">#10238</span>
            </div>
            <div className="flex justify-between mb-4 border-b pb-2">
              <span className="text-gray-500 uppercase text-xs font-bold tracking-widest">Plan</span>
              <span className="font-bold">FITPLAN REGULAR</span>
            </div>
            <div className="flex justify-between mb-4 border-b pb-2">
              <span className="text-gray-500 uppercase text-xs font-bold tracking-widest">Vigencia</span>
              <span className="font-bold">3 MESES</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-gray-500 uppercase text-xs font-bold tracking-widest">Pago Total</span>
              <span className="font-bold text-green-600">MXN 720.00</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/')} 
            className="bg-gray-100 text-gray-700 font-bold py-3 px-8 rounded-2xl hover:bg-gray-200 transition"
          >
            Volver al inicio
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TicketPage;