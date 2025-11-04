
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowDownIcon, ArrowUpIcon, BanknotesIcon, CalendarDaysIcon, CreditCardIcon, WalletIcon } from './icons/Icons';

const kpiData = [
  { title: "Saldo Total", value: "R$ 15.750,80", change: "+2.5%", changeType: "increase" as const, icon: <WalletIcon/> },
  { title: "Receitas (Mês)", value: "R$ 8.230,00", change: "+10.1%", changeType: "increase" as const, icon: <ArrowUpIcon/> },
  { title: "Despesas (Mês)", value: "R$ 3.450,50", change: "-5.2%", changeType: "decrease" as const, icon: <ArrowDownIcon/> },
  { title: "Próximo Vencimento", value: "R$ 280,00", subtext: "Aluguel (5 dias)", changeType: "none" as const, icon: <CalendarDaysIcon/> },
];

const chartData = [
  { name: 'Jan', Receitas: 4000, Despesas: 2400 },
  { name: 'Fev', Receitas: 3000, Despesas: 1398 },
  { name: 'Mar', Receitas: 2000, Despesas: 9800 },
  { name: 'Abr', Receitas: 2780, Despesas: 3908 },
  { name: 'Mai', Receitas: 1890, Despesas: 4800 },
  { name: 'Jun', Receitas: 2390, Despesas: 3800 },
];

const upcomingBills = [
  { id: 1, name: "Aluguel", date: "Vence em 5 dias", amount: "R$ 1.200,00", urgency: "high", icon: <BanknotesIcon/> },
  { id: 2, name: "Fatura Cartão", date: "Vence em 8 dias", amount: "R$ 854,90", urgency: "high", icon: <CreditCardIcon/> },
  { id: 3, name: "Internet", date: "Vence em 12 dias", amount: "R$ 99,90", urgency: "medium", icon: <BanknotesIcon/> },
  { id: 4, name: "Curso de Finanças", date: "Vence em 20 dias", amount: "R$ 150,00", urgency: "low", icon: <BanknotesIcon/> },
];

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

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-dark-gray">Dashboard</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map(item => <KpiCard key={item.title} {...item} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold text-dark-gray mb-4">Fluxo de Caixa (Últimos 6 meses)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip cursor={{fill: 'rgba(0, 122, 94, 0.1)'}} contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}/>
                <Legend iconType="circle" iconSize={10} />
                <Bar dataKey="Receitas" fill="#007A5E" name="Receitas" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Despesas" fill="#FFC857" name="Despesas" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold text-dark-gray mb-4">Próximos Vencimentos</h3>
          <ul className="space-y-4">
            {upcomingBills.map(bill => (
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
        </div>
      </div>
    </div>
  );
};
