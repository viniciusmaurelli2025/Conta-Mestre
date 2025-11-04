
import React, { useState } from 'react';

const Toggle: React.FC<{ label: string; enabled: boolean; onChange: (enabled: boolean) => void }> = ({ label, enabled, onChange }) => (
    <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm text-dark-gray">{label}</span>
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={enabled} onChange={(e) => onChange(e.target.checked)} />
            <div className={`block w-10 h-6 rounded-full transition ${enabled ? 'bg-primary-green' : 'bg-gray-300'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${enabled ? 'transform translate-x-4' : ''}`}></div>
        </div>
    </label>
);

export const Settings: React.FC = () => {
    const [profile, setProfile] = useState({ name: 'Usuário', email: 'usuario@contamestre.com' });
    const [notifications, setNotifications] = useState({
        upcomingBills: true,
        unusualExpenses: true,
        investmentUpdates: false,
        email: true,
        push: true,
        sms: false
    });

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-dark-gray">Configurações</h2>

            {/* Profile Section */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
                <h3 className="text-xl font-bold text-dark-gray mb-4">Perfil</h3>
                <div className="space-y-4">
                     <div>
                        <label className="text-sm font-medium text-dark-gray block mb-1">Nome</label>
                        <input type="text" value={profile.name} onChange={(e) => setProfile(p => ({...p, name: e.target.value}))} className="w-full border-gray-300 rounded-lg focus:ring-primary-green" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-dark-gray block mb-1">Email</label>
                        <input type="email" value={profile.email} onChange={(e) => setProfile(p => ({...p, email: e.target.value}))} className="w-full border-gray-300 rounded-lg focus:ring-primary-green" />
                    </div>
                </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
                <h3 className="text-xl font-bold text-dark-gray mb-4">Notificações</h3>
                <div className="space-y-4">
                    <p className="text-sm font-semibold text-dark-gray">Alertas Inteligentes</p>
                    <Toggle label="Vencimentos Próximos" enabled={notifications.upcomingBills} onChange={e => setNotifications(n => ({...n, upcomingBills: e}))} />
                    <Toggle label="Despesas Incomuns" enabled={notifications.unusualExpenses} onChange={e => setNotifications(n => ({...n, unusualExpenses: e}))} />
                    <Toggle label="Novidades de Investimentos" enabled={notifications.investmentUpdates} onChange={e => setNotifications(n => ({...n, investmentUpdates: e}))} />
                    
                    <p className="text-sm font-semibold text-dark-gray pt-4">Canais de Entrega</p>
                    <Toggle label="Email" enabled={notifications.email} onChange={e => setNotifications(n => ({...n, email: e}))} />
                    <Toggle label="Notificação Push" enabled={notifications.push} onChange={e => setNotifications(n => ({...n, push: e}))} />
                    <Toggle label="SMS" enabled={notifications.sms} onChange={e => setNotifications(n => ({...n, sms: e}))} />
                </div>
            </div>

             {/* Security Section */}
             <div className="bg-white p-6 rounded-2xl shadow-md">
                <h3 className="text-xl font-bold text-dark-gray mb-4">Segurança</h3>
                 <div className="space-y-4">
                    <button className="text-sm font-medium text-primary-green hover:underline">Alterar Senha</button>
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-dark-gray">Autenticação de Dois Fatores (2FA)</p>
                        <button className="px-3 py-1.5 text-sm bg-primary-green text-white rounded-lg hover:bg-green-800">Ativar</button>
                    </div>
                 </div>
            </div>

            <div className="flex justify-end">
                <button className="px-6 py-2 bg-primary-green text-white rounded-lg font-semibold hover:bg-green-800 transition-colors shadow">
                    Salvar Alterações
                </button>
            </div>
        </div>
    );
};
