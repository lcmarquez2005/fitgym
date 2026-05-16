import React from "react";
// @ts-ignore
import Navbar from "../../components/Navbar";
// @ts-ignore
import Footer from "../../components/Footer";
// @ts-ignore
import Sidebar from "../../components/Sidebar";
// @ts-ignore
import ImageCard from "@components/ImageCard";
// @ts-ignore
import gymImage from '../../assets/gym.jpg';

const LandingPage: React.FC = () => {
  return (
    <div className=" bg-[#F6F8FE] ">
      <Sidebar />
      <Navbar />
      <div className="flex flex-col min-h-screen px-4">
        <div className="flex flex-col items-center py-16 px-4 text-center">
          <h1 className="text-black text-4xl md:text-5xl font-bold mb-4 uppercase">
            Bienvenido a FitGym
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            El mejor gimnsaio que se adapta a tu nuevo Cambio Fisico
          </p>
          <ImageCard title="Entrena Cuando Quieras" subtitle="El mejor gymnasio cerca de tu casa..." imageUrl={gymImage} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
