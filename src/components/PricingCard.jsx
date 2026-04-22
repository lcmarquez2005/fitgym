import React from "react";
import { useNavigate } from 'react-router-dom';

const PricingCard = ({ title, price, benefits, imageSrc, buttonText }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-start bg-white py-8 rounded-3xl shadow-lg min-w-[300px]">
      <img
        src={imageSrc || "https://via.placeholder.com/292x200"}
        alt={title}
        className="w-full h-[200px] mb-6 object-cover rounded-t-3xl px-4"
      />
      
      <div className="flex flex-col items-start px-8 mb-4 gap-2">
        <span className="text-black text-xl font-bold uppercase">{title}</span>
        <span className="text-gray-600 text-sm">Disfruta de los siguientes beneficios:</span>
      </div>

      <div className="flex flex-col gap-4 px-8 w-full mb-8 flex-grow">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                {/* Icono de check simple */}
                <span className="text-green-600 text-xs">✓</span>
            </div>
            <span className="text-black text-sm">{benefit}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center w-full px-8 gap-4 mt-auto">
        <button
          className="bg-[#606DE5] py-3 px-6 rounded-3xl w-full md:w-auto hover:bg-[#4a55c2] transition"
          onClick={() => navigate('/checkout', { state: { nombrePlan: title, costo: price } })}
        >
          <span className="text-white text-base font-bold">{buttonText || "¡Lo quiero!"}</span>
        </button>
        <span className="text-black text-base font-bold text-right whitespace-pre-line">
          {price}
        </span>
      </div>
    </div>
  );
};

export default PricingCard;