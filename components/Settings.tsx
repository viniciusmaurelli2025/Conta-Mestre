import React, { useState, useRef, useEffect } from 'react';
import { Theme } from '../App';
import { ArrowUpTrayIcon, TrashIcon } from './icons/Icons';
import { UserProfile } from '../types';

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

interface SettingsProps {
    theme: Theme;
    onThemeChange: (newTheme: Partial<Theme>) => void;
    onResetTheme: () => void;
    userProfile: UserProfile;
    onProfileUpdate: (updatedProfile: UserProfile) => void;
}

export const Settings: React.FC<SettingsProps> = ({ theme, onThemeChange, onResetTheme, userProfile }) => {
    const [notifications, setNotifications] = useState({
        upcomingBills: true,
        unusualExpenses: true,
        investmentUpdates: false,
        email: true,
        push: true,
        sms: false
    });
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onThemeChange({ logo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const removeLogo = () => {
      onThemeChange({ logo: null });
       if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const handleSave = () => {
        setSaveStatus('saving');
        // In a real app, you would save notifications settings here.
        setTimeout(() => {
            setSaveStatus('success');
        }, 1500);
    };

    useEffect(() => {
        if (saveStatus === 'success') {
            const timer = setTimeout(() => {
                setSaveStatus('idle');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [saveStatus]);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-dark-gray">Configurações</h2>
            
            {/* Account Info Card */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
                <h3 className="text-xl font-bold text-dark-gray mb-4">Conta</h3>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-dark-gray font-semibold mt-1">{userProfile.email}</p>
            </div>

            {/* Notifications Section */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
                <h3 className="text-xl font-bold text-dark-gray mb-6">Notificações</h3>
                <div className="space-y-5">
                    <div>
                        <p className="text-sm font-semibold text-dark-gray mb-3">Alertas Inteligentes</p>
                        <div className="space-y-4">
                            <Toggle label="Vencimentos Próximos" enabled={notifications.upcomingBills} onChange={e => setNotifications(n => ({...n, upcomingBills: e}))} />
                            <Toggle label="Despesas Incomuns" enabled={notifications.unusualExpenses} onChange={e => setNotifications(n => ({...n, unusualExpenses: e}))} />
                            <Toggle label="Novidades de Investimentos" enabled={notifications.investmentUpdates} onChange={e => setNotifications(n => ({...n, investmentUpdates: e}))} />
                        </div>
                    </div>
                    <div className="pt-5 border-t border-gray-100">
                        <p className="text-sm font-semibold text-dark-gray mb-3">Canais de Entrega</p>
                        <div className="space-y-4">
                            <Toggle label="Email" enabled={notifications.email} onChange={e => setNotifications(n => ({...n, email: e}))} />
                            <Toggle label="Notificação Push" enabled={notifications.push} onChange={e => setNotifications(n => ({...n, push: e}))} />
                            <Toggle label="SMS" enabled={notifications.sms} onChange={e => setNotifications(n => ({...n, sms: e}))} />
                        </div>
                    </div>
                </div>
            </div>

             {/* Security Section */}
             <div className="bg-white p-6 rounded-2xl shadow-md">
                <h3 className="text-xl font-bold text-dark-gray mb-6">Segurança</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-dark-gray">Alterar Senha</p>
                        <button className="text-sm font-medium text-primary-green hover:underline">Alterar</button>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-dark-gray">Autenticação de Dois Fatores (2FA)</p>
                        <button className="px-3 py-1.5 text-sm bg-primary-green text-white rounded-lg hover:opacity-90">Ativar</button>
                    </div>
                 </div>
            </div>

            {/* Brand Customization Section */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
                <h3 className="text-xl font-bold text-dark-gray mb-4">Personalização da Marca</h3>
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-dark-gray block mb-2">Logo da Empresa</label>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 bg-light-gray rounded-lg flex items-center justify-center border border-dashed">
                                {theme.logo ? <img src={theme.logo} alt="Logo Preview" className="max-w-full max-h-full object-contain"/> : <span className="text-xs text-gray-400">Preview</span>}
                            </div>
                            <div className="flex-1">
                                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleLogoUpload} className="hidden"/>
                                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-dark-gray rounded-lg font-semibold hover:bg-light-gray transition-colors text-sm">
                                    <ArrowUpTrayIcon className="w-5 h-5" />
                                    Carregar Logo
                                </button>
                                {theme.logo && <button onClick={removeLogo} className="flex items-center gap-2 mt-2 px-4 py-2 text-red-600 hover:text-red-800 transition-colors text-sm font-medium">
                                    <TrashIcon className="w-4 h-4" />
                                    Remover Logo
                                </button>}
                            </div>
                        </div>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-dark-gray block mb-2">Cores da Marca</label>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <label htmlFor="primaryColor" className="text-sm text-gray-600">Primária</label>
                                <input id="primaryColor" type="color" value={theme.primaryColor} onChange={e => onThemeChange({primaryColor: e.target.value})} className="w-10 h-10 p-1 bg-white border border-gray-300 rounded-md cursor-pointer"/>
                            </div>
                            <div className="flex items-center gap-3">
                                <label htmlFor="accentColor" className="text-sm text-gray-600">Destaque</label>
                                <input id="accentColor" type="color" value={theme.accentColor} onChange={e => onThemeChange({accentColor: e.target.value})} className="w-10 h-10 p-1 bg-white border border-gray-300 rounded-md cursor-pointer"/>
                            </div>
                         </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                         <button onClick={onResetTheme} className="text-sm font-medium text-primary-green hover:underline">
                            Redefinir para Padrão
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end items-center gap-4 py-4">
                 {saveStatus === 'success' && (
                     <p className="text-sm text-green-600 font-medium transition-opacity duration-300">Alterações salvas com sucesso!</p>
                 )}
                <button 
                    onClick={handleSave} 
                    disabled={saveStatus === 'saving'}
                    className="px-6 py-2 bg-primary-green text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {saveStatus === 'saving' ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </div>
        </div>
    );
};