import React from 'react';
import logoImage from '../assets/logo.png';
import Sidebar from './Sidebar';

const Header: React.FC = () => {
  return (
    <div className="flex flex-row align-center justify-center items-center self-stretch mb-[30px]">
          <Sidebar />
          <a href='#' className="flex items-center gap-3">
            <img
              src={logoImage}
              className="w-11 h-11 object-contain "
              alt="Fitgym Logo"
            />
            <span className="text-black text-[32px] font-bakbak">FITGYM</span>
          </a>
    </div>
  );
};

export default Header;
