import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { LogOut, Calendar, ShieldCheck, Sun, Moon } from "lucide-react";
import peopleImage from "@assets/people.png";
import { BASE_URL } from "@services/api.config";

interface ClientNavbarProps {
  mesPagado?: string;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ClientNavbar = ({ mesPagado = "S/D", isDarkMode, toggleTheme }: ClientNavbarProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getImageUrl = (path?: string): string => {
    if (!path) return peopleImage;
    if (path.startsWith('data:image')) return path;
    if (path.startsWith('/uploads/')) {
      const host = BASE_URL.replace('/api', '');
      return `${host}${path}`;
    }
    return path;
  };

  return (
    <nav className={`w-full border-b px-6 py-4 flex items-center justify-between z-50 sticky top-0 shrink-0 transition-all duration-300 backdrop-blur-md ${
      isDarkMode 
        ? "bg-[#0B0F19]/80 border-gray-850 text-white shadow-lg" 
        : "bg-white/80 border-gray-100 text-slate-800 shadow-sm"
    }`}>
      {/* Logo Section */}
      <Link to="/dashboard" className="flex items-center gap-3 group">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 shadow-inner group-hover:scale-105 ${
          isDarkMode ? "bg-slate-900 border-gray-800" : "bg-[#F6F8FE] border-gray-150"
        }`}>
          <img src="/images/logo.png" alt="FITGYM" className="w-7 h-7 object-contain" />
        </div>
        <span className={`text-xl font-bakbak uppercase tracking-tight transition-colors ${
          isDarkMode ? "text-white" : "text-black"
        }`}>
          FITGYM <span className="text-[#606DE5] text-xs font-bold">CLIENTE</span>
        </span>
      </Link>

      {/* Account & Status Section */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Mes Pagado Badge */}
        <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl border transition-colors duration-300 ${
          isDarkMode 
            ? "bg-emerald-950/20 border-emerald-900/50 text-emerald-400" 
            : "bg-green-50 border-green-100 text-green-700"
        }`}>
          <Calendar className={isDarkMode ? "text-emerald-400" : "text-green-600"} size={18} />
          <div className="flex flex-col">
            <span className={`text-[10px] font-bold uppercase leading-none ${isDarkMode ? "text-emerald-500/80" : "text-green-500"}`}>
              Mes Pagado
            </span>
            <span className="text-sm font-extrabold capitalize leading-tight">{mesPagado}</span>
          </div>
        </div>

        {/* Separator */}
        <div className={`h-8 w-[1px] hidden sm:block ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`} />

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
            isDarkMode 
              ? "bg-slate-900 border-gray-800 text-amber-400 hover:bg-slate-850" 
              : "bg-gray-50 border-gray-150 text-slate-600 hover:bg-gray-100"
          }`}
          aria-label="Toggle Theme"
          title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {isDarkMode ? <Sun size={18} className="animate-pulse" /> : <Moon size={18} />}
        </button>

        {/* User Info */}
        <div className={`flex items-center gap-3 px-3 py-1.5 rounded-2xl border transition-colors duration-300 ${
          isDarkMode ? "bg-slate-900/55 border-gray-800" : "bg-gray-50 border-gray-100"
        }`}>
          <div className="text-right hidden md:block">
            <p className={`text-sm font-bold leading-tight ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              {user?.name || "Usuario"}
            </p>
            <p className="text-[9px] font-extrabold text-indigo-450 uppercase tracking-widest leading-none mt-0.5">
              {user?.rol || "SOCIO"}
            </p>
          </div>
          <div className={`w-10 h-10 rounded-full border-2 overflow-hidden shadow-sm transition-all duration-300 ${
            isDarkMode ? "border-slate-800 bg-slate-950" : "border-white bg-indigo-50"
          }`}>
            <img src={getImageUrl(user?.fotoPerfil)} className="w-full h-full object-cover" alt="User" />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-0.5 ml-1">
            <button 
              onClick={() => navigate("/")}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isDarkMode 
                  ? "text-gray-400 hover:text-indigo-400 hover:bg-slate-800" 
                  : "text-gray-400 hover:text-[#606DE5] hover:bg-white"
              }`}
              title="Volver al Inicio"
            >
              <ShieldCheck size={18} />
            </button>
            <button 
              onClick={handleLogout}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isDarkMode 
                  ? "text-gray-400 hover:text-rose-450 hover:bg-slate-800" 
                  : "text-gray-400 hover:text-red-500 hover:bg-white"
              }`}
              title="Cerrar Sesión"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ClientNavbar;
