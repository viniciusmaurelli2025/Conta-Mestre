import React, { useState, useMemo } from 'react';
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, XMarkIcon } from './icons/Icons';
import { Transaction, TransactionType } from '../types';

const categories = ['Salário', 'Moradia', 'Alimentação', 'Freelance', 'Contas', 'Lazer', 'Transporte', 'Saúde', 'Investimentos', 'Outros'];

const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const formatDate = (dateString: string) => new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', { timeZone: 'UTC' });

const TransactionModal: React.FC<{
    transaction: Partial<Transaction> | null;
    onClose: () => void;
    onSave: (transaction: Omit<Transaction, 'id'> & { id?: number }) => void;
}> = ({ transaction, onClose, onSave }) => {
    const [formData, setFormData] = useState<Omit<Transaction, 'id'> & { id?: number }>({
        description: '',
        amount: 0,
        type: 'expense',
        category: categories[0],
        date: new Date().toISOString().split('T')[0],
        ...transaction
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let processedValue: string | number = value;

        if (name === 'amount') {
           processedValue = value ? parseFloat(value) : '';
        }

        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(formData.amount <= 0) {
            alert("O valor da transação deve ser positivo.");
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-dark-gray">{transaction?.id ? 'Editar' : 'Adicionar'} Transação</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-dark-gray"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-dark-gray block mb-1">Descrição</label>
                        <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full border-gray-300 rounded-lg focus:ring-primary-green" required/>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-dark-gray block mb-1">Valor</label>
                        <input type="number" name="amount" value={formData.amount} onChange={handleChange} step="0.01" min="0.01" className="w-full border-gray-300 rounded-lg focus:ring-primary-green" required/>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-sm font-medium text-dark-gray block mb-1">Tipo</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="w-full border-gray-300 rounded-lg focus:ring-primary-green">
                                <option value="expense">Despesa</option>
                                <option value="income">Receita</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-medium text-dark-gray block mb-1">Categoria</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full border-gray-300 rounded-lg focus:ring-primary-green">
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-dark-gray block mb-1">Data</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border-gray-300 rounded-lg focus:ring-primary-green" required/>
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

interface TransactionsProps {
    transactions: Transaction[];
    onSave: (transactionData: Omit<Transaction, 'id'> & { id?: number }) => void;
    onDelete: (id: number) => void;
}

export const Transactions: React.FC<TransactionsProps> = ({ transactions, onSave, onDelete }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Partial<Transaction> | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | TransactionType>('all');

    const handleSave = (transactionData: Omit<Transaction, 'id'> & { id?: number }) => {
        onSave(transactionData);
        setShowModal(false);
        setEditingTransaction(null);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
            onDelete(id);
        }
    };

    const filteredTransactions = useMemo(() => {
        return transactions
            .filter(t => filterType === 'all' || t.type === filterType)
            .filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [transactions, searchTerm, filterType]);

    return (
        <div className="space-y-6">
            {showModal && <TransactionModal transaction={editingTransaction} onClose={() => { setShowModal(false); setEditingTransaction(null); }} onSave={handleSave} />}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h2 className="text-3xl font-bold text-dark-gray">Transações</h2>
                <button onClick={() => { setEditingTransaction({}); setShowModal(true); }} className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-green text-white rounded-lg font-semibold hover:bg-green-800 transition-colors shadow">
                    <PlusIcon className="w-5 h-5" />
                    Adicionar Transação
                </button>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="relative md:col-span-2">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="text" placeholder="Buscar por descrição..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full border-gray-200 bg-light-gray rounded-lg pl-10 focus:ring-primary-green" />
                    </div>
                    <select value={filterType} onChange={e => setFilterType(e.target.value as any)} className="w-full border-gray-200 bg-light-gray rounded-lg focus:ring-primary-green">
                        <option value="all">Todos os tipos</option>
                        <option value="income">Receitas</option>
                        <option value="expense">Despesas</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-light-gray">
                            <tr>
                                <th className="px-6 py-3">Descrição</th>
                                <th className="px-6 py-3">Valor</th>
                                <th className="px-6 py-3">Categoria</th>
                                <th className="px-6 py-3">Data</th>
                                <th className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map(t => (
                                <tr key={t.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-dark-gray">{t.description}</td>
                                    <td className={`px-6 py-4 font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.type === 'expense' && '-'}{formatCurrency(t.amount)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{t.category}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{formatDate(t.date)}</td>
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <button onClick={() => { setEditingTransaction(t); setShowModal(true); }} className="text-gray-400 hover:text-primary-green"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(t.id)} className="text-gray-400 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {filteredTransactions.length === 0 && <p className="text-center text-gray-500 py-8">Nenhuma transação encontrada. Clique em 'Adicionar Transação' para começar.</p>}
            </div>
        </div>
    );
};