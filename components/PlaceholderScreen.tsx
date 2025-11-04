
import React from 'react';

interface PlaceholderScreenProps {
  icon: React.ReactNode;
  title: string;
  message: string;
}

export const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ icon, title, message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center bg-white rounded-2xl p-8 shadow-md">
      <div className="w-20 h-20 text-primary-green bg-green-100 rounded-full flex items-center justify-center mb-6">
        {React.cloneElement(icon as React.ReactElement, { className: 'w-10 h-10' })}
      </div>
      <h2 className="text-2xl font-bold text-dark-gray mb-2">{title}</h2>
      <p className="text-gray-500 max-w-sm">{message}</p>
    </div>
  );
};
