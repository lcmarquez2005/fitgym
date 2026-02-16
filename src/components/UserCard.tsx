import React from 'react';

interface UserCardProps {
  index: number;
  name: string;
  controlNumber: string;
  imageUrl: string;
}

const UserCard: React.FC<UserCardProps> = ({ index, name, controlNumber, imageUrl }) => {
  return (
    <div className="flex items-center gap-2.5 p-3 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer">
      <img
        src={imageUrl}
        className="w-14 h-14 object-cover rounded-full border-2 border-white shadow-sm"
        alt="User"
      />
      <div className="flex flex-col items-start gap-0.5">
        <span className="text-black text-[19px] leading-tight font-inter font-bold">{name}</span>
        <span className="text-gray-400 text-[17px] font-inter">{controlNumber}{index}</span>
      </div>
    </div>
  );
};

export default UserCard;
