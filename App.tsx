
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { MestreIAChat } from './components/MestreIAChat';
import { Reports } from './components/Reports';
import { Community } from './components/Community';
import { Transactions } from './components/Transactions';
import { Calendar } from './components/Calendar';
import { Settings } from './components/Settings';

type Screen = 'dashboard' | 'transactions' | 'calendar' | 'reports' | 'mestreIA' | 'community' | 'settings';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard />;
      case 'mestreIA':
        return <MestreIAChat />;
      case 'transactions':
        return <Transactions />;
      case 'calendar':
        return <Calendar />;
      case 'reports':
        return <Reports />;
      case 'community':
        return <Community />;
       case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-light-gray font-sans text-dark-gray">
      <Sidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light-gray p-4 sm:p-6 lg:p-8">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
};

export default App;
