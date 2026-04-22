import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "./Icon";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/",         label: "Inicio",         icon: "home" },
    { path: "/socios",   label: "Socios",          icon: "users" },
    { path: "/cobros",   label: "Cobros",          icon: "dollar" },
    { path: "/reportes", label: "Reportes",        icon: "chart" },
    { path: "/config",   label: "Configuración",   icon: "settings" },
  ];

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay oscuro en móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 xl:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel del sidebar */}
      <aside
        style={{
          transition: "transform 0.3s cubic-bezier(.4,0,.2,1)",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          willChange: "transform",
        }}
        className="fixed xl:static xl:translate-x-0 z-40 xl:z-auto
                   flex flex-col h-full w-64 bg-[#9FDDFF] py-8 px-4 gap-2 shrink-0"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 mb-8">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <Icon name="dumbbell" size={20} color="white" />
          </div>
          <span className="text-black text-xl font-black tracking-widest">FITGYM</span>

          {/* Botón cerrar (solo móvil) */}
          <button
            onClick={onClose}
            className="ml-auto xl:hidden text-black/60 hover:text-black"
          >
            <Icon name="close" size={20} color="currentColor" />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all
                  ${active
                    ? "bg-white text-black shadow-md"
                    : "text-black/70 hover:bg-white/50 hover:text-black"
                  }`}
              >
                <Icon name={item.icon} size={18} color={active ? "#3851EE" : "currentColor"} />
                {item.label}
                {active && (
                  <span className="ml-auto">
                    <Icon name="chevronRight" size={14} color="#3851EE" />
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Cerrar sesión */}
        <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-black/60 hover:bg-white/50 hover:text-black transition-all mt-4">
          <Icon name="logout" size={18} color="currentColor" />
          Cerrar sesión
        </button>
      </aside>
    </>
  );
}