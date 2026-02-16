import React from 'react';

interface UserCardProps {
  index: number;
  name: string;
  controlNumber: string;
  imageUrl: string;
}

const UserCard: React.FC<UserCardProps> = ({ index, name, controlNumber, imageUrl }) => {
  return (
    <div className="flex items-center gap-2.5 p-2 hover:bg-gray-100 rounded-2xl transition-all cursor-pointer">
      <div className="flex items-center justify-center flex-shrink-1">
        <img
          src={imageUrl}
          className="w-18 h-18 rounded-full border-4 border-white shadow-sm"
          alt="User"
        />
      </div>
      <div className="flex flex-col items-start gap-0.5">
        <span className="text-black text-[19px] leading-tight font-inter font-bold">{name}</span>
        <span className="text-gray-400 text-[17px] font-inter">{controlNumber}{index}</span>
      </div>
    </div>
  );
};

export default UserCard;
