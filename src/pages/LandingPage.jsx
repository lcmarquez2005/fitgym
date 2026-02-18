import React from "react";
import Navbar from "../components/Navbar";
import PricingCard from "../components/PricingCard";
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  // 1. Inicializamos la función de navegación
  const navigate = useNavigate();

  // 2. Creamos la función que se ejecutará al hacer clic en cualquier plan
  const handleBuy = () => {
    navigate('/checkout');
  };

  return (
    <div className="flex flex-col bg-[#F6F8FE] min-h-screen">
      <Navbar />

      <div className="flex flex-col items-center py-16 px-4 text-center">
        <h1 className="text-black text-4xl md:text-5xl font-bold mb-4 uppercase">
          FITGYM PLANS
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl">
          Encuentra el plan que mejor se adapte a tu estilo de vida, checa entre nuestros diferentes planes
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-stretch max-w-[1200px] mx-auto gap-8 px-4 mb-20">
        
        {/* Agregamos onBuy={handleBuy} a cada tarjeta */}
        <PricingCard 
          title="FITPLAN REGULAR"
          price={"MXN 800.00/\n3 Meses"}
          imageSrc="/images/plan1.png"
          onBuy={handleBuy} // <--- ¡Esto es clave!
          benefits={[
            "Acceso a todas las áreas de pesas",
            "Sesión personal de entrenamiento",
            "Descuento personal exclusivo"
          ]}
        />

        <PricingCard 
          title="SUPER FITPLAN"
          price={"MXN 1100.00/\n3 Meses"}
          imageSrc="/images/plan2.png"
          onBuy={handleBuy}
          benefits={[
            "Acceso a todas las áreas del gimnasio",
            "Rutina personalizada y asesor de dieta",
            "Sesión de entrenamiento para dos",
            "Descuento personal exclusivo"
          ]}
        />

        <PricingCard 
          title="MEGA FITPLAN"
          price={"MXN 3500.00/\n12 Meses"}
          imageSrc="/images/plan3.png"
          onBuy={handleBuy}
          benefits={[
            "Acceso al área de SPA",
            "Clases grupales (Boxeo, Yoga, etc)",
            "Sesión de entrenamiento para cinco",
            "Descuento grupal exclusivo"
          ]}
        />

      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;