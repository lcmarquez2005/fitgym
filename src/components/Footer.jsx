import React from "react";

const Footer = () => {
  return (
    <div className="w-full bg-black max-w-[1200px] pt-16 px-8 md:px-20 mx-auto rounded-[28px] mb-10 text-white">
      <div className="flex flex-col md:flex-row items-start justify-between mb-12 gap-10">
        
        {/* Columna Logo */}
        <div className="flex flex-col items-start gap-6 max-w-sm">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" className="w-11 h-11" alt="Logo" />
            <span className="text-xl font-bold">FITGYM</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            El mejor sistema ERP de gimnasio del mundo que gestiona de manera eficiente a sus usuarios.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-16">
          <div className="flex flex-col gap-4">
            <span className="text-lg font-bold">More to Know</span>
            <a href="#" className="text-gray-300 hover:text-white">Blog</a>
            <a href="#" className="text-gray-300 hover:text-white">Subscription</a>
            <a href="#" className="text-gray-300 hover:text-white">Testimonial</a>
            <a href="#" className="text-gray-300 hover:text-white">About</a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-lg font-bold">Contact Us</span>
            <span className="text-gray-300">021-0892-2323</span>
            <span className="text-gray-300">@fitcamp.body.fit</span>
            <span className="text-gray-300">admin@fitcamp.com</span>
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-800 h-[1px] mb-7"></div>

      <div className="flex flex-col md:flex-row justify-between items-center pb-8 gap-4 text-sm text-gray-400">
        <span>2026 fitgymcorption</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Cookies</a>
        </div>
      </div>
    </div>
  );
};

export default Footer;