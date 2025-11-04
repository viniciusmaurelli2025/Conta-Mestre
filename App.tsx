
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { MestreIAChat } from './components/MestreIAChat';
import { Reports } from './components/Reports';
import { Community } from './components/Community';
import { Transactions } from './components/Transactions';
import { Calendar } from './components/Calendar';
import { Settings } from './components/Settings';
import { Goals } from './components/Goals';

type Screen = 'dashboard' | 'transactions' | 'calendar' | 'reports' | 'mestreIA' | 'community' | 'goals' | 'settings';

export interface Theme {
  logo: string | null;
  primaryColor: string;
  accentColor: string;
}

const defaultTheme: Theme = {
  logo: null,
  primaryColor: '#007A5E',
  accentColor: '#FFC857',
};

// Helper to convert hex to RGB string for CSS variables
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : '0 122 94';
};


const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  const applyTheme = useCallback((themeToApply: Theme) => {
    document.documentElement.style.setProperty('--color-primary-rgb', hexToRgb(themeToApply.primaryColor));
    document.documentElement.style.setProperty('--color-accent-rgb', hexToRgb(themeToApply.accentColor));
  }, []);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('contaMestreTheme');
      const loadedTheme = savedTheme ? { ...defaultTheme, ...JSON.parse(savedTheme) } : defaultTheme;
      setTheme(loadedTheme);
      applyTheme(loadedTheme);
    } catch (e) {
      console.error("Failed to load theme from localStorage", e);
      setTheme(defaultTheme);
      applyTheme(defaultTheme);
    }
  }, [applyTheme]);

  const handleThemeChange = (newTheme: Partial<Theme>) => {
    setTheme(prevTheme => {
      const updatedTheme = { ...prevTheme, ...newTheme };
      try {
        localStorage.setItem('contaMestreTheme', JSON.stringify(updatedTheme));
        applyTheme(updatedTheme);
      } catch (e) {
        console.error("Failed to save theme to localStorage", e);
      }
      return updatedTheme;
    });
  };

  const handleResetTheme = () => {
    try {
      localStorage.removeItem('contaMestreTheme');
      setTheme(defaultTheme);
      applyTheme(defaultTheme);
    } catch (e) {
      console.error("Failed to reset theme", e);
    }
  };

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
      case 'goals':
        return <Goals />;
       case 'settings':
        return <Settings theme={theme} onThemeChange={handleThemeChange} onResetTheme={handleResetTheme} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-light-gray font-sans text-dark-gray">
      <Sidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} logo={theme.logo} />
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
