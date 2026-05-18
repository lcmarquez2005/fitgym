import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleClick = () => {
    onSearch(searchValue);
  };


  return (
    <div className="flex flex-col md:flex-row items-start md:items-center self-stretch gap-4 md:gap-7">
      <span className="text-black text-2xl shrink-0 font-bakbak">Buscar Usuario:</span>
      <div className="flex flex-1 w-full justify-between items-center bg-[#EFF4FD] py-2 rounded-[90px] border border-solid border-[#0000001A]">
        <input 
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Busca por Nombre o Nro Control..."
          className="bg-transparent text-black text-[17px] ml-6 flex-1 outline-none placeholder-[#BFBFBF] font-inter font-medium"
        />
        <button 
          className="flex flex-col shrink-0 items-start bg-black text-left py-3 px-8 mr-3 rounded-3xl border-0 hover:bg-gray-800 transition-colors cursor-pointer font-bakbak"
          onClick={handleClick}
        >
          <span className="text-white text-[19px]">Search</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
