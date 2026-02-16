import React from 'react';
import { MapPin } from 'lucide-react';
import SearchBar from './SearchBar';
import UserCard from './UserCard';
import ReportSection from './ReportSection';

interface LeftPanelProps {
  inscritos: number;
  sinPagar: number;
  onSearch: () => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ inscritos, sinPagar, onSearch }) => {
  const users = Array.from({ length: 7 }, (_, i) => ({
    id: i,
    name: 'Luis Marquez',
    controlNumber: '2320028',
    imageUrl: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KQqb07sxCU/hif9khww_expires_30_days.png',
  }));

  return (
    <div className="flex flex-1 flex-col bg-white p-6 md:p-8 gap-8 rounded-3xl shadow-sm border border-gray-200">
      <div className="flex flex-col items-start self-stretch gap-1">
        <span className="text-black text-[40px] leading-tight font-bakbak">FITGYM</span>
        <div className="flex items-center gap-2">
          <MapPin size={20} className="text-gray-400" />
          <span className="text-gray-500 text-xl font-inter font-semibold">
            San Javier, Pachuca
          </span>
        </div>
      </div>

      <div className="flex flex-col self-stretch gap-6">
        <div className="flex flex-col self-stretch gap-6">
          <SearchBar onSearch={onSearch} />
          <div className="w-full h-[1px] bg-gray-100" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {users.map((user, index) => (
            <UserCard
              key={user.id}
              index={index}
              name={user.name}
              controlNumber={user.controlNumber}
              imageUrl={user.imageUrl}
            />
          ))}
        </div>
      </div>

      <ReportSection inscritos={inscritos} sinPagar={sinPagar} />
    </div>
  );
};

export default LeftPanel;
