import React from "react";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center w-full max-w-[1200px] mx-auto py-4 px-4 lg:px-0">
      <div className="flex shrink-0 items-center gap-3">
        {/* Reemplaza este src con tu logo local eventualmente */}
        <img
          src="images/logo.png" 
          alt="Logo"
          className="w-11 h-11 object-contain"
        />
        <span className="text-black text-xl font-bold">FITGYM</span>
      </div>
      
      {/* Menú Desktop - Oculto en móviles */}
      <div className="hidden md:flex shrink-0 items-center gap-8">
        <div className="flex items-center gap-6">
          <a href="#" className="text-black text-base hover:text-blue-600 transition">Suscribete</a>
          <a href="#" className="text-black text-base hover:text-blue-600 transition">Blog</a>
          <a href="#" className="text-black text-base hover:text-blue-600 transition">Testimonial</a>
          <a href="#" className="text-black text-base hover:text-blue-600 transition">About</a>
        </div>
        <button 
          className="bg-[#606DE5] py-3 px-6 rounded-3xl hover:bg-[#4a55c2] transition"
          onClick={() => alert("Ir a Login")}
        >
          <span className="text-white text-base font-bold">Log in</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;