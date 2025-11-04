import React, { useState, useRef, useEffect } from 'react';
import { BellIcon, MagnifyingGlassIcon, ChevronDownIcon, ArrowRightOnRectangleIcon, UserCircleIcon, Cog6ToothIcon } from './icons/Icons';
import { UserProfile } from '../types';

type Screen = 'dashboard' | 'transactions' | 'calendar' | 'reports' | 'mestreIA' | 'community' | 'goals' | 'settings' | 'profile';

interface HeaderProps {
  onLogout: () => void;
  userProfile: UserProfile;
  setActiveScreen: (screen: Screen) => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout, userProfile, setActiveScreen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 p-1 rounded-lg hover:bg-light-gray"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            {userProfile.avatar ? (
              <img
                src={userProfile.avatar}
                alt="User avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <UserCircleIcon className="w-10 h-10 text-gray-400" />
            )}
            <div className="hidden sm:block text-left">
              <p className="font-semibold text-sm">{userProfile.name}</p>
              <p className="text-xs text-gray-500">Plano Pro</p>
            </div>
             <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl z-50 overflow-hidden border border-gray-100" role="menu">
              <ul>
                <li className="p-4 border-b">
                  <p className="font-semibold text-sm">{userProfile.name}</p>
                  <p className="text-xs text-gray-500 truncate">{userProfile.email}</p>
                </li>
                <li>
                  <button onClick={() => { setActiveScreen('profile'); setIsDropdownOpen(false); }} className="w-full text-left flex items-center px-4 py-3 text-sm text-dark-gray hover:bg-light-gray transition-colors" role="menuitem">
                    <UserCircleIcon className="w-5 h-5 mr-3 text-gray-500"/>
                    Meu Perfil
                  </button>
                </li>
                 <li>
                  <button onClick={() => { setActiveScreen('settings'); setIsDropdownOpen(false); }} className="w-full text-left flex items-center px-4 py-3 text-sm text-dark-gray hover:bg-light-gray transition-colors" role="menuitem">
                    <Cog6ToothIcon className="w-5 h-5 mr-3 text-gray-500"/>
                    Configurações
                  </button>
                </li>
                <li>
                  <button
                    onClick={onLogout}
                    className="w-full text-left flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t"
                    role="menuitem"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3"/>
                    Sair
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};