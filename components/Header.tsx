
import React from 'react';
import { BellIcon, MagnifyingGlassIcon } from './icons/Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div className="relative w-full max-w-xs">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar transações..."
          className="block w-full bg-light-gray border border-gray-200 rounded-lg py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-dark-gray transition-colors">
          <BellIcon className="h-6 w-6" />
        </button>
        <div className="flex items-center space-x-2">
          <img
            src="https://picsum.photos/40/40"
            alt="User avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="hidden sm:block">
            <p className="font-semibold text-sm">Usuário</p>
            <p className="text-xs text-gray-500">Plano Pro</p>
          </div>
        </div>
      </div>
    </header>
  );
};
