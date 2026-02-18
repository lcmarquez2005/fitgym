import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    // Contenedor principal
    <nav className="w-full flex justify-center bg-white"> 
      <div className="flex justify-between items-center w-full max-w-[1200px] py-4 px-4 lg:px-0">
        
        {/* --- LOGO --- */}
        {/* Usamos Link para que al hacer clic en el logo vaya al inicio */}
        <Link to="/" className="flex shrink-0 items-center gap-3">
          {/* Asegúrate de que la imagen esté en la carpeta public/images/ */}
          <img
            src="/images/logo.png" 
            alt="FITGYM Logo"
            className="w-11 h-11 object-contain"
          />
          <span className="text-black text-xl font-bold">FITGYM</span>
        </Link>
        
        {/* --- MENÚ DESKTOP (Oculto en móviles) --- */}
        <div className="hidden md:flex shrink-0 items-center gap-8">
          
          {/* Enlaces de navegación */}
          <div className="flex items-center gap-6">
            <Link to="/suscribete" className="text-black text-base hover:text-blue-600 transition-colors">Suscribete</Link>
            <Link to="/blog" className="text-black text-base hover:text-blue-600 transition-colors">Blog</Link>
            <Link to="/testimonial" className="text-black text-base hover:text-blue-600 transition-colors">Testimonial</Link>
            <Link to="/about" className="text-black text-base hover:text-blue-600 transition-colors">About</Link>
          </div>

          {/* Botón de Login */}
          <button 
            className="bg-[#606DE5] py-3 px-6 rounded-3xl hover:bg-[#4a55c2] transition-all active:scale-95 shadow-md shadow-indigo-100"
            onClick={() => navigate("/dashboard")} 
          >
            <span className="text-white text-base font-bold">Log in</span>
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;