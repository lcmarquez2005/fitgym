import React from 'react';

import logoImage from '../assets/logo.png';

const Footer: React.FC = () => {
  return (
    <div className="self-stretch bg-black p-8 md:p-[70px] mt-12 rounded-[40px] w-[90%] mx-auto shadow-xl font-bakbak">
      <div className="flex flex-col md:flex-row items-start self-stretch mb-[40px] gap-12">
        <div className="flex flex-1 flex-col items-start gap-7">
          <a href='#' className="flex items-center gap-3">
            <img
              src={logoImage}
              className="w-11 h-11 object-contain "
              alt="Fitgym Logo"
            />
            <span className="text-white text-[32px]">FITGYM</span>
          </a>
          <span className="text-gray-400 text-lg max-w-sm leading-relaxed font-inter font-medium">
            El mejor sistema ERP de gimnasio del mundo que gestiona de manera eficiente a sus usuarios.
          </span>
        </div>

        <div className="grid grid-cols-2 gap-16 md:gap-24 font-inter">
          <div className="flex flex-col items-start gap-4 text-gray-500">
            <span className="text-white text-xl font-bakbak">Mas info...</span>
            <a href="#" className="hover:text-white transition-all">Blog</a>
            <a href="#" className="hover:text-white transition-all">Subscription</a>
            <a href="#" className="hover:text-white transition-all">About</a>
          </div>
          <div className="flex flex-col items-start gap-4 text-gray-500 ">
            <span className="text-white text-lg font-bakbak">Contacto</span>
            <span>021-0892-2323</span>
            <span>@fitcamp.body.fit</span>
            <span>admin@fitcamp.com</span>
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-gray-700 mb-[35px]" />

      <div className="flex flex-col md:flex-row justify-between items-center self-stretch gap-6 text-gray-500 font-inter font-bold">
        <span>2024 fitcampcorption</span>
        <div className="flex items-center gap-8 text-sm">
          <a href="#" className="hover:text-white transition-all">Terms of Services</a>
          <a href="#" className="hover:text-white transition-all">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-all">Cookies</a>
          <a href="#" className="hover:text-white transition-all">Legal</a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
