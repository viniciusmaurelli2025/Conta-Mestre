
import React from 'react';
import { ChartPieIcon, DocumentTextIcon, CalendarIcon, ChartBarIcon, ChatBubbleLeftRightIcon, UsersIcon, TargetIcon, Cog6ToothIcon } from './icons/Icons';

type Screen = 'dashboard' | 'transactions' | 'calendar' | 'reports' | 'mestreIA' | 'community' | 'goals' | 'settings';

interface SidebarProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
  logo: string | null;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li
    onClick={onClick}
    className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 ${
      isActive
        ? 'bg-primary-green text-white shadow-md'
        : 'text-gray-600 hover:bg-green-100 hover:text-primary-green'
    }`}
  >
    <div className="w-6 h-6 mr-4">{icon}</div>
    <span className="font-medium">{label}</span>
  </li>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeScreen, setActiveScreen, logo }) => {
  return (
    <aside className="w-64 bg-white shadow-lg flex-shrink-0 hidden md:block">
      <div className="p-6 flex items-center justify-center border-b h-[73px]">
        {logo ? (
          <img src={logo} alt="Custom Logo" className="max-h-12 max-w-full" />
        ) : (
          <>
            <svg className="w-8 h-8 text-primary-green mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="text-2xl font-bold text-dark-gray">Conta<span className="text-primary-green">Mestre</span></h1>
          </>
        )}
      </div>
      <nav className="p-4">
        <ul>
          <NavItem icon={<ChartPieIcon />} label="Dashboard" isActive={activeScreen === 'dashboard'} onClick={() => setActiveScreen('dashboard')} />
          <NavItem icon={<DocumentTextIcon />} label="Transações" isActive={activeScreen === 'transactions'} onClick={() => setActiveScreen('transactions')} />
          <NavItem icon={<CalendarIcon />} label="Calendário" isActive={activeScreen === 'calendar'} onClick={() => setActiveScreen('calendar')} />
          <NavItem icon={<ChartBarIcon />} label="Relatórios" isActive={activeScreen === 'reports'} onClick={() => setActiveScreen('reports')} />
          <NavItem icon={<ChatBubbleLeftRightIcon />} label="MestreIA" isActive={activeScreen === 'mestreIA'} onClick={() => setActiveScreen('mestreIA')} />
          <NavItem icon={<UsersIcon />} label="Comunidade" isActive={activeScreen === 'community'} onClick={() => setActiveScreen('community')} />
          <NavItem icon={<TargetIcon />} label="Metas" isActive={activeScreen === 'goals'} onClick={() => setActiveScreen('goals')} />
          <NavItem icon={<Cog6ToothIcon />} label="Configurações" isActive={activeScreen === 'settings'} onClick={() => setActiveScreen('settings')} />
        </ul>
      </nav>
    </aside>
  );
};
