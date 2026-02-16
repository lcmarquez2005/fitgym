import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="flex flex-col items-center self-stretch mb-[30px]">
      <div className="flex items-center gap-3">
        <div className="hidden md:block w-24 h-[41px]"></div>
        <img
          src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KQqb07sxCU/luo4ffjw_expires_30_days.png"
          className="w-11 h-11 object-contain"
          alt="Logo"
        />
        <span className="text-black text-[29px] font-bakbak">FITGYM</span>
        <div className="w-11 h-11"></div>
      </div>
    </div>
  );
};

export default Header;
