import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";

const Navbar = ({ isDark = false }: { isDark?: boolean }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    const container = document.getElementById("landing-scroll-container");
    if (element && container) {
      container.style.scrollSnapType = "none";
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        container.style.scrollSnapType = "y mandatory";
      }, 800);
    } else {
      navigate(`/#${targetId}`);
    }
  };

  return (
    // Contenedor principal
    <nav className="w-full flex justify-center z-50 relative"> 
      <div className="flex justify-between items-center w-full max-w-[1200px] py-4 px-4 lg:px-0">
        
        {/* --- LOGO --- */}
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <img
            src="/images/logo.png" 
            alt="FITGYM Logo"
            className="w-11 h-11 object-contain"
          />
          <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>FITGYM</span>
        </Link>
        
        {/* --- MENÚ DESKTOP (Oculto en móviles) --- */}
        <div className="hidden md:flex shrink-0 items-center gap-8">
          {/* Enlaces de navegación */}
          <div className="flex items-center gap-5">
            <a href="#hero-section" onClick={(e) => handleScroll(e, "hero-section")} className={`text-sm font-semibold hover:text-[#606DE5] transition-colors ${isDark ? 'text-gray-300 hover:text-[#606DE5]' : 'text-black'}`}>Inicio</a>
            <a href="#zonas-section" onClick={(e) => handleScroll(e, "zonas-section")} className={`text-sm font-semibold hover:text-[#606DE5] transition-colors ${isDark ? 'text-gray-300 hover:text-[#606DE5]' : 'text-black'}`}>Instalaciones</a>
            <a href="#nosotros-section" onClick={(e) => handleScroll(e, "nosotros-section")} className={`text-sm font-semibold hover:text-[#606DE5] transition-colors ${isDark ? 'text-gray-300 hover:text-[#606DE5]' : 'text-black'}`}>Nosotros</a>
            <a href="#planes-section" onClick={(e) => handleScroll(e, "planes-section")} className={`text-sm font-semibold hover:text-[#606DE5] transition-colors ${isDark ? 'text-gray-300 hover:text-[#606DE5]' : 'text-black'}`}>Planes</a>
            <a href="#testimonios-section" onClick={(e) => handleScroll(e, "testimonios-section")} className={`text-sm font-semibold hover:text-[#606DE5] transition-colors ${isDark ? 'text-gray-300 hover:text-[#606DE5]' : 'text-black'}`}>Testimonios</a>
          </div>

          {/* Botón de Login o Dashboard */}
          {isAuthenticated ? (
            <button 
              className={`py-3 px-6 rounded-3xl hover:opacity-90 transition-all active:scale-95 shadow-md font-bold text-base cursor-pointer ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}
              onClick={() => navigate("/erp")} 
            >
              Dashboard
            </button>
          ) : (
            <button 
              className="bg-[#606DE5] py-3 px-6 rounded-3xl hover:bg-[#4a55c2] text-white text-base font-bold transition-all active:scale-95 shadow-md shadow-indigo-100 cursor-pointer"
              onClick={() => navigate("/login")} 
            >
              Log in
            </button>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;