
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { MestreIAChat } from './components/MestreIAChat';
import { Reports } from './components/Reports';
import { Community } from './components/Community';
import { Transactions } from './components/Transactions';
import { Calendar, mockEvents } from './components/Calendar';
import { Settings } from './components/Settings';
import { Goals } from './components/Goals';
import { LoginScreen } from './components/LoginScreen';
import { Profile } from './components/Profile';
import { UserProfile, Transaction, Goal, Kpi } from './types';
import { DocumentTextIcon, WalletIcon, ArrowUpIcon, ArrowDownIcon, CalendarDaysIcon } from './components/icons/Icons';


type Screen = 'dashboard' | 'transactions' | 'calendar' | 'reports' | 'mestreIA' | 'community' | 'goals' | 'settings' | 'profile';

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

const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);


const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Usuário',
    email: 'usuario@contamestre.com',
    bio: 'Adicione uma bio para se apresentar à comunidade.',
    profession: 'Sua Profissão',
    website: '',
    avatar: 'https://picsum.photos/100/100',
    coverPhoto: null,
  });

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    // In a real app, you would also save this to a backend.
  };

  const handleSaveTransaction = (transactionData: Omit<Transaction, 'id'> & { id?: number }) => {
        if (transactionData.id) {
            setTransactions(transactions.map(t => t.id === transactionData.id ? { ...t, ...transactionData } as Transaction : t));
        } else {
            const newTransaction: Transaction = {
                ...transactionData,
                id: Math.max(0, ...transactions.map(t => t.id)) + 1,
            };
            setTransactions(prev => [newTransaction, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }
    };

    const handleDeleteTransaction = (id: number) => {
        setTransactions(transactions.filter(t => t.id !== id));
    };

    const handleSaveGoal = (goalData: Omit<Goal, 'id' | 'icon'> & { id?: number }) => {
        if (goalData.id) {
            setGoals(goals.map(g => g.id === goalData.id ? { ...g, ...goalData } as Goal : g));
        } else {
            const newGoal: Goal = {
                ...goalData,
                id: Math.max(0, ...goals.map(g => g.id)) + 1,
                icon: <DocumentTextIcon className="w-8 h-8"/>,
            };
            setGoals(prev => [newGoal, ...prev]);
        }
    };

    const handleDeleteGoal = (id: number) => {
        setGoals(goals.filter(g => g.id !== id));
    };

    const handleContributeToGoal = (goalId: number, amount: number) => {
        setGoals(goals.map(g => g.id === goalId ? {...g, currentAmount: g.currentAmount + amount} : g));
    };


  // FIX: Calculate KPI data from transactions to provide context for the AI chat, resolving the missing 'dashboard' property error.
  const kpiData = useMemo((): Kpi[] => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let totalBalance = 0;
    let monthlyIncome = 0;
    let monthlyExpenses = 0;

    transactions.forEach(t => {
        if (t.type === 'income') {
            totalBalance += t.amount;
        } else {
            totalBalance -= t.amount;
        }

        const transactionDate = new Date(t.date + 'T00:00:00');
        const transactionMonth = transactionDate.getMonth();
        const transactionYear = transactionDate.getFullYear();

        if (transactionYear === currentYear && transactionMonth === currentMonth) {
            if (t.type === 'income') {
                monthlyIncome += t.amount;
            } else {
                monthlyExpenses += t.amount;
            }
        }
    });
    
    const upcomingBills = transactions
        .filter(t => t.type === 'expense' && new Date(t.date + 'T00:00:00') >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
    const nextBillTransaction = upcomingBills[0];
    const nextBill = nextBillTransaction ? {
        name: nextBillTransaction.description,
        amount: formatCurrency(nextBillTransaction.amount),
    } : null;

    return [
      { title: "Saldo Total", value: formatCurrency(totalBalance), changeType: "none", icon: <WalletIcon/> },
      { title: "Receitas (Mês)", value: formatCurrency(monthlyIncome), changeType: "none", icon: <ArrowUpIcon/> },
      { title: "Despesas (Mês)", value: formatCurrency(monthlyExpenses), changeType: "none", icon: <ArrowDownIcon/> },
      { title: "Próximo Vencimento", value: nextBill ? nextBill.amount : "R$ 0,00", subtext: nextBill ? nextBill.name : "Nenhum vencimento", changeType: "none", icon: <CalendarDaysIcon/> },
    ];
  }, [transactions]);


  // In a real app, this data would come from a central state management store or API
  const userData = {
    dashboard: kpiData,
    transactions: transactions,
    calendarEvents: mockEvents,
    goals: goals,
  };

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
  
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveScreen('dashboard'); // Reset to default screen on logout
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard transactions={transactions} />;
      case 'mestreIA':
        return <MestreIAChat userData={userData} />;
      case 'transactions':
        return <Transactions transactions={transactions} onSave={handleSaveTransaction} onDelete={handleDeleteTransaction} />;
      case 'calendar':
        return <Calendar />;
      case 'reports':
        return <Reports />;
      case 'community':
        return <Community userProfile={userProfile} />;
       case 'goals':
        return <Goals goals={goals} onSave={handleSaveGoal} onDelete={handleDeleteGoal} onContribute={handleContributeToGoal} />;
       case 'settings':
        return <Settings theme={theme} onThemeChange={handleThemeChange} onResetTheme={handleResetTheme} userProfile={userProfile} onProfileUpdate={handleProfileUpdate} />;
       case 'profile':
        return <Profile profile={userProfile} onUpdate={handleProfileUpdate} />;
      default:
        return <Dashboard transactions={transactions} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen bg-light-gray font-sans text-dark-gray">
      <Sidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} logo={theme.logo} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={handleLogout} userProfile={userProfile} setActiveScreen={setActiveScreen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light-gray p-4 sm:p-6 lg:p-8">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
};

export default App;