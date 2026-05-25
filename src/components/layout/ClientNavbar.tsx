import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { LogOut, Calendar, ShieldCheck } from "lucide-react";
import peopleImage from "@assets/people.png";

const ClientNavbar = ({ mesPagado = "S/D" }: { mesPagado?: string }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-50 sticky top-0 shadow-sm">
      {/* Logo Section */}
      <Link to="/dashboard" className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#F6F8FE] rounded-xl flex items-center justify-center border border-gray-50 shadow-inner">
          <img src="/images/logo.png" alt="FITGYM" className="w-7 h-7 object-contain" />
        </div>
        <span className="text-xl font-bakbak text-black uppercase tracking-tight">FITGYM <span className="text-[#606DE5] text-xs">CLIENTE</span></span>
      </Link>

      {/* Account & Status Section */}
      <div className="flex items-center gap-6">
        {/* Mes Pagado Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-green-50 px-4 py-2 rounded-2xl border border-green-100">
          <Calendar className="text-green-600" size={18} />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-green-500 uppercase leading-none">Mes Pagado</span>
            <span className="text-sm font-bold text-green-700 capitalize leading-tight">{mesPagado}</span>
          </div>
        </div>

        {/* Separator */}
        <div className="h-8 w-[1px] bg-gray-100 hidden sm:block" />

        {/* User Info */}
        <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-2xl border border-gray-100">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-gray-800 leading-tight">{user?.name || "Usuario"}</p>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{user?.rol || "SOCIO"}</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm">
            <img src={peopleImage} className="w-full h-full object-cover" alt="User" />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1 ml-1">
            <button 
              onClick={() => navigate("/")}
              className="p-2 text-gray-400 hover:text-[#606DE5] hover:bg-white rounded-xl transition-all"
              title="Volver al Inicio"
            >
              <ShieldCheck size={20} />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-xl transition-all"
              title="Cerrar Sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ClientNavbar;
