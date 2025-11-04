
import React, { useState, useMemo } from 'react';
import { Boleto } from '../types';
import { CheckCircleIcon, ClipboardDocumentListIcon, PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from './icons/Icons';
import { PlaceholderScreen } from './PlaceholderScreen';

const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const formatDate = (dateString: string) => new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', { timeZone: 'UTC' });

const BoletoModal: React.FC<{
    boleto: Partial<Boleto> | null;
    onClose: () => void;
    onSave: (boleto: Omit<Boleto, 'id' | 'paid'> & { id?: number }) => void;
}> = ({ boleto, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: boleto?.name || '',
        amount: boleto?.amount || '',
        dueDate: boleto?.dueDate || new Date().toISOString().split('T')[0],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            alert("A descrição é obrigatória.");
            return;
        }
        if (Number(formData.amount) <= 0) {
            alert("O valor do boleto deve ser positivo.");
            return;
        }
        onSave({
            id: boleto?.id,
            name: formData.name,
            amount: Number(formData.amount),
            dueDate: formData.dueDate,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-dark-gray">{boleto?.id ? 'Editar' : 'Adicionar'} Boleto</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-dark-gray"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-dark-gray block mb-1">Descrição</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border-gray-300 rounded-lg focus:ring-primary-green" required />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-dark-gray block mb-1">Valor</label>
                        <input type="number" name="amount" value={formData.amount} onChange={handleChange} step="0.01" min="0.01" className="w-full border-gray-300 rounded-lg focus:ring-primary-green" required />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-dark-gray block mb-1">Data de Vencimento</label>
                        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full border-gray-300 rounded-lg focus:ring-primary-green" required />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-light-gray text-dark-gray rounded-lg hover:bg-gray-200">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-green-800">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const getUrgency = (dueDate: string, paid: boolean): { color: string; text: string } => {
    if (paid) return { color: 'bg-green-100 text-green-700', text: 'Pago' };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(dueDate + 'T00:00:00');
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { color: 'bg-red-100 text-red-700', text: `Atrasado ${Math.abs(diffDays)}d` };
    if (diffDays === 0) return { color: 'bg-red-100 text-red-700', text: 'Vence hoje' };
    if (diffDays <= 3) return { color: 'bg-yellow-100 text-yellow-700', text: `Vence em ${diffDays}d` };
    return { color: 'bg-blue-100 text-blue-700', text: `Vence em ${diffDays}d` };
};

const BoletoItem: React.FC<{
    boleto: Boleto;
    onToggle: () => void;
    onEdit: () => void;
    onDelete: () => void;
}> = ({ boleto, onToggle, onEdit, onDelete }) => {
    const urgency = getUrgency(boleto.dueDate, boleto.paid);

    return (
        <div
            className={`flex items-center p-4 border rounded-lg transition-all duration-200 ${
                boleto.paid ? 'bg-gray-50 opacity-60' : 'bg-white hover:shadow-md'
            }`}
        >
            <button
                onClick={onToggle}
                aria-label={boleto.paid ? 'Marcar como não pago' : 'Marcar como pago'}
                className="flex-shrink-0 mr-4 p-1"
            >
                {boleto.paid ? (
                    <CheckCircleIcon className="w-6 h-6 text-primary-green" />
                ) : (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full hover:border-primary-green transition-colors"></div>
                )}
            </button>
            <div className="flex-1">
                <p className={`font-semibold text-dark-gray ${boleto.paid ? 'line-through' : ''}`}>{boleto.name}</p>
                <p className={`text-sm ${boleto.paid ? 'text-gray-400' : 'text-gray-600'}`}>
                    {formatCurrency(boleto.amount)}
                </p>
            </div>
            <div className="text-right ml-2 sm:ml-4">
                <p className={`text-sm font-medium ${boleto.paid ? 'text-gray-400' : 'text-dark-gray'}`}>
                    {formatDate(boleto.dueDate)}
                </p>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full mt-1 inline-block ${urgency.color}`}>
                    {urgency.text}
                </span>
            </div>
            <div className="flex flex-col ml-4 pl-4 border-l border-gray-200">
                <button onClick={onEdit} className="text-gray-400 hover:text-primary-green p-1" aria-label="Editar boleto">
                    <PencilIcon className="w-5 h-5" />
                </button>
                <button onClick={onDelete} className="text-gray-400 hover:text-red-500 p-1" aria-label="Excluir boleto">
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

interface ChecklistProps {
    boletos: Boleto[];
    onTogglePaid: (id: number) => void;
    onSave: (boletoData: Omit<Boleto, 'id' | 'paid'> & { id?: number }) => void;
    onDelete: (id: number) => void;
}

export const Checklist: React.FC<ChecklistProps> = ({ boletos, onTogglePaid, onSave, onDelete }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingBoleto, setEditingBoleto] = useState<Partial<Boleto> | null>(null);

    const handleSave = (boletoData: Omit<Boleto, 'id' | 'paid'> & { id?: number }) => {
        onSave(boletoData);
        setShowModal(false);
        setEditingBoleto(null);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este boleto?')) {
            onDelete(id);
        }
    };
    
    const sortedBoletos = [...boletos].sort((a, b) => {
        if (a.paid !== b.paid) return a.paid ? 1 : -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    const summary = React.useMemo(() => {
        const unpaid = boletos.filter(b => !b.paid);
        const total = unpaid.reduce((sum, b) => sum + b.amount, 0);
        return {
            count: unpaid.length,
            total: formatCurrency(total)
        };
    }, [boletos]);

    return (
        <div className="space-y-6">
            {showModal && <BoletoModal boleto={editingBoleto} onClose={() => { setShowModal(false); setEditingBoleto(null); }} onSave={handleSave} />}

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h2 className="text-3xl font-bold text-dark-gray">Checklist Boletos</h2>
                <button onClick={() => { setEditingBoleto({}); setShowModal(true); }} className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-green text-white rounded-lg font-semibold hover:bg-green-800 transition-colors shadow">
                    <PlusIcon className="w-5 h-5" />
                    Adicionar Boleto
                </button>
            </div>
            
            {boletos.length === 0 ? (
                 <PlaceholderScreen 
                    icon={<ClipboardDocumentListIcon />} 
                    title="Nenhum boleto no seu checklist"
                    message="Adicione suas contas recorrentes aqui para nunca mais esquecer um pagamento."
                />
            ) : (
            <>
                <div className="bg-white p-4 rounded-2xl shadow-md">
                    <h3 className="text-lg font-semibold text-dark-gray">Resumo</h3>
                    <p className="text-gray-600">
                        Você tem <span className="font-bold text-primary-green">{summary.count}</span> {summary.count === 1 ? 'boleto a pagar' : 'boletos a pagar'},
                        totalizando <span className="font-bold text-primary-green">{summary.total}</span>.
                    </p>
                </div>

                <div className="space-y-3">
                    {sortedBoletos.map(boleto => (
                        <BoletoItem
                            key={boleto.id}
                            boleto={boleto}
                            onToggle={() => onTogglePaid(boleto.id)}
                            onEdit={() => { setEditingBoleto(boleto); setShowModal(true); }}
                            onDelete={() => handleDelete(boleto.id)}
                        />
                    ))}
                </div>
            </>
            )}
        </div>
    );
};
