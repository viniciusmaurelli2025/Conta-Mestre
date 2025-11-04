import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowDownIcon, ArrowUpIcon, BanknotesIcon, CalendarDaysIcon, CreditCardIcon, WalletIcon } from './icons/Icons';
import { Transaction } from '../types';

const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

interface UpcomingBill {
    id: number;
    name: string;
    date: string;
    amount: string;
    urgency: "high" | "medium" | "low";
    icon: React.ReactElement;
}

const getUrgency = (dueDate: Date): 'high' | 'medium' | 'low' => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 3) return 'high';
    if (diffDays <= 7) return 'medium';
    return 'low';
};


const KpiCard: React.FC<{ title: string; value: string; change?: string; changeType: 'increase' | 'decrease' | 'none'; subtext?: string; icon: React.ReactNode; }> = ({ title, value, change, changeType, subtext, icon }) => {
  const changeColor = changeType === 'increase' ? 'text-green-500' : 'text-red-500';
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md flex-1">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="text-primary-green">{icon}</div>
      </div>
      <p className="text-2xl font-bold text-dark-gray mt-2">{value}</p>
      {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
      {changeType !== 'none' && (
        <p className={`text-xs mt-1 ${changeColor}`}>{change}</p>
      )}
    </div>
  );
};

const UrgencyBadge: React.FC<{ urgency: 'high' | 'medium' | 'low' }> = ({ urgency }) => {
    const styles = {
        high: 'bg-red-100 text-red-700',
        medium: 'bg-yellow-100 text-yellow-700',
        low: 'bg-green-100 text-green-700'
    };
    const text = {
        high: 'Alta',
        medium: 'Média',
        low: 'Baixa'
    }
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[urgency]}`}>{text[urgency]}</span>
}

interface DashboardProps {
    transactions: Transaction[];
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
    const dashboardData = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        let totalBalance = 0;
        let monthlyIncome = 0;
        let monthlyExpenses = 0;

        const monthlyChartData: { [key: string]: { name: string; Receitas: number; Despesas: number } } = {};

        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentYear, currentMonth - i, 1);
            const monthName = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
            const yearMonthKey = `${date.getFullYear()}-${date.getMonth()}`;
            monthlyChartData[yearMonthKey] = { name: monthName.charAt(0).toUpperCase() + monthName.slice(1), Receitas: 0, Despesas: 0 };
        }

        const upcomingBills: UpcomingBill[] = [];

        transactions.forEach(t => {
            if (t.type === 'income') {
                totalBalance += t.amount;
            } else {
                totalBalance -= t.amount;
            }

            const transactionDate = new Date(t.date + 'T00:00:00');
            const transactionMonth = transactionDate.getMonth();
            const transactionYear = transactionDate.getFullYear();

            // Calculate current month's income and expenses
            if (transactionYear === currentYear && transactionMonth === currentMonth) {
                if (t.type === 'income') {
                    monthlyIncome += t.amount;
                } else {
                    monthlyExpenses += t.amount;
                }
            }

            // Populate chart data for the last 6 months
            const yearMonthKey = `${transactionYear}-${transactionMonth}`;
            if (monthlyChartData[yearMonthKey]) {
                if (t.type === 'income') {
                    monthlyChartData[yearMonthKey].Receitas += t.amount;
                } else {
                    monthlyChartData[yearMonthKey].Despesas += t.amount;
                }
            }

            // Populate upcoming bills
            if (t.type === 'expense' && transactionDate >= now) {
                upcomingBills.push({
                    id: t.id,
                    name: t.description,
                    date: `Vence em ${transactionDate.toLocaleDateString('pt-BR')}`,
                    amount: formatCurrency(t.amount),
                    urgency: getUrgency(transactionDate),
                    icon: t.category.toLowerCase().includes('cartão') ? <CreditCardIcon /> : <BanknotesIcon />,
                });
            }
        });
        
        upcomingBills.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const nextBill = upcomingBills[0];

        const kpiData = [
          { title: "Saldo Total", value: formatCurrency(totalBalance), changeType: "none" as const, icon: <WalletIcon/> },
          { title: "Receitas (Mês)", value: formatCurrency(monthlyIncome), changeType: "none" as const, icon: <ArrowUpIcon/> },
          { title: "Despesas (Mês)", value: formatCurrency(monthlyExpenses), changeType: "none" as const, icon: <ArrowDownIcon/> },
          { title: "Próximo Vencimento", value: nextBill ? nextBill.amount : "R$ 0,00", subtext: nextBill ? nextBill.name : "Nenhum vencimento", changeType: "none" as const, icon: <CalendarDaysIcon/> },
        ];
        
        return { kpiData, chartData: Object.values(monthlyChartData), upcomingBills: upcomingBills.slice(0,5) };

    }, [transactions]);


  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-dark-gray">Dashboard</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.kpiData.map(item => <KpiCard key={item.title} {...item} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold text-dark-gray mb-4">Fluxo de Caixa (Últimos 6 meses)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={dashboardData.chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(value) => formatCurrency(Number(value))} />
                <Tooltip cursor={{fill: 'rgba(0, 122, 94, 0.1)'}} contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }} formatter={(value) => formatCurrency(Number(value))}/>
                <Legend iconType="circle" iconSize={10} />
                <Bar dataKey="Receitas" fill="#007A5E" name="Receitas" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Despesas" fill="#FFC857" name="Despesas" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold text-dark-gray mb-4">Próximos Vencimentos</h3>
          {dashboardData.upcomingBills.length > 0 ? (
            <ul className="space-y-4">
              {dashboardData.upcomingBills.map(bill => (
                <li key={bill.id} className="flex items-center space-x-4">
                  <div className="p-3 bg-light-gray rounded-full text-primary-green">{bill.icon}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{bill.name}</p>
                    <p className="text-xs text-gray-500">{bill.date}</p>
                  </div>
                  <div className="text-right">
                      <p className="font-bold text-sm">{bill.amount}</p>
                      <UrgencyBadge urgency={bill.urgency as 'high' | 'medium' | 'low'} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">Nenhum vencimento nos próximos dias.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};