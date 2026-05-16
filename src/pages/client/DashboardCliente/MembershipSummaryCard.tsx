import React from "react";

interface MembershipSummaryCardProps {
  images: {
    purpleCircle: string;
    orangeTicket: string;
  };
}

const MembershipSummaryCard: React.FC<MembershipSummaryCardProps> = ({ images }) => {
  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm flex flex-col md:flex-row w-full xl:w-7/12 items-center gap-8 overflow-visible">
      {/* SECCIÓN GRÁFICA (Izquierda dentro de la tarjeta) */}
      <div className="relative w-[280px] h-[300px] shrink-0">
        {/* Círculo Morado (FONDO) */}
        <img 
          src={images.purpleCircle} 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] object-contain z-0" 
          alt="Circle Bg" 
        />
        
        {/* Ticket Naranja (FRENTE) - Desplazado ligeramente para efecto 3D */}
        <img 
          src={images.orangeTicket} 
          className="absolute top-0 left-4 w-full h-full object-contain z-10 drop-shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500" 
          alt="Ticket" 
        />
      </div>

      {/* SECCIÓN DATOS (Derecha dentro de la tarjeta) */}
      <div className="flex flex-col gap-2 w-full">
        <h3 className="text-black text-xl font-bold mb-4">Resumen de membresía</h3>
        
        <div className="space-y-3 text-sm text-gray-800">
          <p><span className="font-bold">Tipo actual</span> <span className="text-gray-500">/ Individual</span></p>
          <p><span className="font-bold">Fecha inicio</span> <span className="text-gray-500">/ xx/xx/xxxx</span></p>
          <p><span className="font-bold">Fecha vencimiento</span> <span className="text-gray-500">/ xx/xx/xxxx</span></p>
          <p><span className="font-bold">Precio pagado</span> <span className="text-gray-500">/ $xxx</span></p>
          <p><span className="font-bold">Método de pago</span> <span className="text-gray-500">/ T,E,TR</span></p>
          <p className="font-bold text-gray-500">Rp 199.000 / 3 Month</p>
        </div>

        <div className="mt-4 flex justify-start">
          <button className="bg-[#3ACAFF] hover:bg-[#32b2e0] text-white text-sm font-bold py-3 px-8 rounded-3xl shadow-lg shadow-cyan-100">
            Historial de pagos
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipSummaryCard;
