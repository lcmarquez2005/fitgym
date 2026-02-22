import React from 'react';

interface ImageCardProps {
  index: number |null;
  title: string;
  subtitle: string;
  imageUrl: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ index, title, subtitle, imageUrl }) => {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden relative flex items-center my-6 justify-center aspect-[5/1]"
      style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
      >
        <span
          className="text-white font-bold text-xl md:text-2xl text-center hidden"
        >{index}</span>
        <span
          className="text-white my-2 font-bold text-xl md:text-2xl text-center"
        >{title}</span>
        <span
          className="text-gray-200 drop-shadow-lg  text-md md:text-lg text-center"
        >{subtitle}</span>
      </div>
    </div>
  );
};

export default ImageCard;
