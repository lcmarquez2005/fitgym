import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="flex flex-col items-start self-stretch mb-[36px] gap-1">
      <span className="text-black text-4xl md:text-5xl leading-none font-bakbak">DASHBOARD</span>
      <span className="text-gray-500 text-[22px] md:text-[24px] font-inter font-medium">
        Menu principal de opciones
      </span>
    </div>
  );
};

export default Hero;
