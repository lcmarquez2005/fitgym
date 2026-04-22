// components/Sidebar.tsx (agregar estado para controlar el modal)
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserPlus, 
  Dumbbell, 
  ShieldCheck, 
  LogOut,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { AltaUsuario } from './client/AltaUsuario';

interface SidebarProps {
  userName?: string;
  role?: string;
  activeTab?: string;
  onNavigate?: (tab: string) => void;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  userName = "Luis", 
  role = "Admin", 
  activeTab: propActiveTab = "Dashboard",
  onNavigate,
  onLogout 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAltaUsuario, setShowAltaUsuario] = useState(false);
  const location = useLocation();
  // Sincroniza el tab activo con la ruta
  const getActiveTab = () => {
    if (location.pathname.startsWith('/erp')) return 'Dashboard';
    if (location.pathname.startsWith('/plans')) return 'Planes';
    if (location.pathname.startsWith('/control')) return 'Control Acceso';
    if (location.pathname.startsWith('/alta')) return 'Alta de Usuario';
    if (location.pathname.startsWith('/socio')) return 'Socio';
    return propActiveTab;
  };
  const [activeTab, setActiveTab] = useState<string>('Dashboard');

  // Actualiza el tab activo cuando cambia la ruta
  React.useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={24} /> },
    { name: "Alta de Usuario", icon: <UserPlus size={24} /> },
    { name: "Planes", icon: <Dumbbell size={24} /> },
    { name: "Control Acceso", icon: <ShieldCheck size={24} /> },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleNavigation = (name: string) => {
    setActiveTab(name);
    if (name === "Alta de Usuario") {
      setShowAltaUsuario(true);
      setIsOpen(false);
    } else if(name === "Dashboard") {
      navigate('/erp');
      setIsOpen(false);
    }  else if(name === "Planes") {
      setActiveTab('Planes')
      navigate('/planes');
      setIsOpen(false);
    } else {
      onNavigate?.(name);
      setIsOpen(false);
    }
  };

  const handleUserCreated = (userData: any) => {
    console.log('Usuario creado exitosamente:', userData);
    // Aquí puedes agregar lógica adicional como actualizar una lista, mostrar notificación, etc.
  };

  return (
    <>
      {/* Botón Hamburguesa */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-6 left-6 z-40 p-3 bg-white opacity-[0.8] rounded-full shadow-lg hover:bg-gray-50 transition-all border border-gray-100 text-black active:scale-95"
        aria-label="Abrir menú"
      >
        <Menu size={28} />
      </button>

      {/* Botón para ir a LandingPage */}
      {/* <button
        onClick={() => { setIsOpen(false); navigate('/'); }}
        className="fixed top-20 left-6 z-40 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all border border-blue-700 active:scale-95"
      >
        Ir a LandingPage
      </button> */}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 w-[320px] z-50 bg-transparent font-inter transition-transform duration-300 ease-in-out transform 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-full p-6">
          <div 
            className="flex flex-col items-start bg-white h-full py-8 px-6 rounded-[26px] border border-gray-100 relative"
            style={{ boxShadow: "5px 6px 17px rgba(0, 0, 0, 0.15)" }}
          >
            {/* Botón Cerrar interno */}
            <button 
              onClick={toggleSidebar}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all"
            >
              <X size={20} />
            </button>

            {/* Perfil de Usuario */}
            <div className="flex items-center mb-6 gap-3 w-full mt-4">
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KQqb07sxCU/92au2agi_expires_30_days.png"
                className="w-[60px] h-[60px] rounded-full object-cover border-2 border-gray-50"
                alt="Avatar"
              />
              <div className="flex flex-1 flex-col items-start gap-0">
                <span className="text-black text-[22px] font-bakbak leading-tight">
                  {userName}
                </span>
                <span className="text-gray-500 text-[16px] font-inter font-medium">
                  {role}
                </span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                <Settings size={20} />
              </button>
            </div>

            <div className="bg-gray-200 w-full h-[1px] mb-6" />

            {/* Menú de Navegación */}
            <nav className="flex flex-col w-full gap-2 mb-6 flex-1 overflow-y-auto">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.name)}
                  className={`flex items-center w-full p-3 rounded-xl transition-all gap-3 group
                    ${activeTab === item.name 
                      ? 'bg-black text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <div className={`${activeTab === item.name ? 'text-white' : 'text-gray-400 group-hover:text-black'}`}>
                    {item.icon}
                  </div>
                  <span className="text-[19px] font-inter font-semibold">
                    {item.name}
                  </span>
                </button>
              ))}
            </nav>

            <div className="bg-gray-200 w-full h-[1px] mb-6" />

            {/* Botón Log Out */}
            <button 
              className="flex items-center justify-center w-full bg-[#606DE5] hover:bg-[#4f5bd1] text-white py-4 px-6 rounded-2xl border-0 transition-all shadow-lg active:scale-95 gap-2"
              onClick={onLogout}
            >
              <LogOut size={20} onClick={() => navigate('/')} />
              <span className="text-[20px] font-bakbak">
                Log Out
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Modal de Alta de Usuario */}
      {showAltaUsuario && (
        <AltaUsuario 
          onClose={() => setShowAltaUsuario(false)}
          onUserCreated={handleUserCreated}
        />
      )}
    </>
  );
};

export default Sidebar;