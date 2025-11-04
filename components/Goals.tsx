
import React, { useState, useMemo } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, BanknotesIcon, PaperAirplaneIcon, DocumentTextIcon, WalletIcon, TargetIcon } from './icons/Icons';
import { PlaceholderScreen } from './PlaceholderScreen';

interface Goal {
    id: number;
    name: string;
    icon: React.ReactElement;
    currentAmount: number;
    targetAmount: number;
    targetDate: string;
}

const initialGoals: Goal[] = [
    { id: 1, name: 'Viagem para a Europa', icon: <PaperAirplaneIcon className="w-8 h-8"/>, currentAmount: 7500, targetAmount: 20000, targetDate: '2024-12-31' },
    { id: 2, name: 'Reserva de Emergência', icon: <WalletIcon className="w-8 h-8"/>, currentAmount: 12000, targetAmount: 15000, targetDate: '2024-08-01' },
    { id: 3, name: 'Entrada do Apartamento', icon: <BanknotesIcon className="w-8 h-8"/>, currentAmount: 23500, targetAmount: 50000, targetDate: '2025-06-30' },
];

const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const GoalModal: React.FC<{
    goal: Partial<Goal> | null;
    onClose: () => void;
    onSave: (goal: Omit<Goal, 'id' | 'icon'> & { id?: number }) => void;
}> = ({ goal, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: goal?.name || '',
        targetAmount: goal?.targetAmount || '',
        currentAmount: goal?.currentAmount || '',
        targetDate: goal?.targetDate || new Date().toISOString().split('T')[0],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...goal,
            name: formData.name,
            targetAmount: Number(formData.targetAmount),
            currentAmount: Number(formData.currentAmount),
            targetDate: formData.targetDate,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-dark-gray">{goal?.id ? 'Editar' : 'Criar'} Meta</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-dark-gray"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label="Nome da Meta" name="name" value={formData.name} onChange={handleChange} required />
                    <InputField label="Valor Alvo" name="targetAmount" type="number" value={formData.targetAmount} onChange={handleChange} required />
                    <InputField label="Valor Inicial" name="currentAmount" type="number" value={formData.currentAmount} onChange={handleChange} required />
                    <InputField label="Data Alvo" name="targetDate" type="date" value={formData.targetDate} onChange={handleChange} required />
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-light-gray text-dark-gray rounded-lg hover:bg-gray-200">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-green-800">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ContributionModal: React.FC<{
    goal: Goal;
    onClose: () => void;
    onSave: (amount: number) => void;
}> = ({ goal, onClose, onSave }) => {
    const [amount, setAmount] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (Number(amount) > 0) {
            onSave(Number(amount));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-dark-gray">Adicionar Contribuição</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-dark-gray"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <p className="text-sm text-gray-500 mb-4">Meta: <span className="font-semibold">{goal.name}</span></p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label="Valor a Adicionar" name="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} autoFocus required />
                     <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-light-gray text-dark-gray rounded-lg hover:bg-gray-200">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-green-800">Adicionar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const InputField = (props: React.ComponentProps<'input'> & { label: string }) => (
    <div>
        <label className="text-sm font-medium text-dark-gray block mb-1">{props.label}</label>
        <input {...props} className="w-full border-gray-300 rounded-lg focus:ring-primary-green focus:border-primary-green text-sm" />
    </div>
);

const GoalCard: React.FC<{
    goal: Goal;
    onContribute: () => void;
    onEdit: () => void;
    onDelete: () => void;
}> = ({ goal, onContribute, onEdit, onDelete }) => {
    const progress = useMemo(() => {
        return goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
    }, [goal.currentAmount, goal.targetAmount]);

    return (
        <div className="bg-white p-5 rounded-2xl shadow-md flex flex-col">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-light-gray rounded-full flex items-center justify-center text-primary-green">
                        {goal.icon}
                    </div>
                    <div>
                        <h4 className="font-bold text-dark-gray">{goal.name}</h4>
                        <p className="text-xs text-gray-400">Vence em {new Date(goal.targetDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>
                <div className="flex gap-2 text-gray-400">
                    <button onClick={onEdit} className="hover:text-primary-green"><PencilIcon className="w-5 h-5"/></button>
                    <button onClick={onDelete} className="hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                </div>
            </div>

            <div className="my-4 flex-grow">
                <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-primary-green">{formatCurrency(goal.currentAmount)}</span>
                    <span className="text-gray-500">{formatCurrency(goal.targetAmount)}</span>
                </div>
                <div className="w-full bg-light-gray rounded-full h-2.5">
                    <div className="bg-primary-green h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                </div>
                <p className="text-right text-xs text-gray-500 mt-1">{progress.toFixed(1)}% completo</p>
            </div>
            
            <button onClick={onContribute} className="w-full mt-2 py-2 px-4 bg-green-100 text-primary-green font-semibold rounded-lg hover:bg-green-200 transition-colors">
                Adicionar Contribuição
            </button>
        </div>
    );
};


export const Goals: React.FC = () => {
    const [goals, setGoals] = useState<Goal[]>(initialGoals);
    const [modal, setModal] = useState<'none' | 'goal' | 'contribution'>('none');
    const [selectedGoal, setSelectedGoal] = useState<Goal | Partial<Goal> | null>(null);

    const handleOpenGoalModal = (goal?: Goal) => {
        setSelectedGoal(goal || {});
        setModal('goal');
    };

    const handleOpenContributionModal = (goal: Goal) => {
        setSelectedGoal(goal);
        setModal('contribution');
    };

    const handleCloseModal = () => {
        setModal('none');
        setSelectedGoal(null);
    };

    const handleSaveGoal = (goalData: Omit<Goal, 'id' | 'icon'> & { id?: number }) => {
        if (goalData.id) {
            setGoals(goals.map(g => g.id === goalData.id ? { ...g, ...goalData } : g));
        } else {
            const newGoal: Goal = {
                ...goalData,
                id: Math.max(0, ...goals.map(g => g.id)) + 1,
                icon: <DocumentTextIcon className="w-8 h-8"/>, // Default icon for new goals
            };
            setGoals([newGoal, ...goals]);
        }
        handleCloseModal();
    };
    
    const handleSaveContribution = (amount: number) => {
        if (selectedGoal && 'id' in selectedGoal) {
             setGoals(goals.map(g => g.id === selectedGoal.id ? {...g, currentAmount: g.currentAmount + amount} : g));
        }
        handleCloseModal();
    };

    const handleDeleteGoal = (id: number) => {
        setGoals(goals.filter(g => g.id !== id));
    };

    return (
        <div className="space-y-6 h-full">
            {modal === 'goal' && <GoalModal goal={selectedGoal} onClose={handleCloseModal} onSave={handleSaveGoal} />}
            {modal === 'contribution' && selectedGoal && 'id' in selectedGoal && <ContributionModal goal={selectedGoal as Goal} onClose={handleCloseModal} onSave={handleSaveContribution}/>}
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h2 className="text-3xl font-bold text-dark-gray">Minhas Metas</h2>
                <button onClick={() => handleOpenGoalModal()} className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-green text-white rounded-lg font-semibold hover:bg-green-800 transition-colors shadow">
                    <PlusIcon className="w-5 h-5" />
                    Adicionar Meta
                </button>
            </div>
            
            {goals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {goals.map(goal => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            onContribute={() => handleOpenContributionModal(goal)}
                            onEdit={() => handleOpenGoalModal(goal)}
                            onDelete={() => handleDeleteGoal(goal.id)}
                        />
                    ))}
                </div>
            ) : (
                <PlaceholderScreen 
                    icon={<TargetIcon />} 
                    title="Crie sua primeira meta!"
                    message="Defina objetivos financeiros, como uma viagem ou a compra de um imóvel, e acompanhe seu progresso para torná-los realidade."
                />
            )}
        </div>
    );
};
