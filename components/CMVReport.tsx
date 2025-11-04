import React, { useState, useMemo } from 'react';
import { ArrowPathIcon } from './icons/Icons';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const CMVReport: React.FC = () => {
    const [initialStock, setInitialStock] = useState<number | string>(0);
    const [purchases, setPurchases] = useState<number | string>(0);
    const [finalStock, setFinalStock] = useState<number | string>(0);

    const cmv = useMemo(() => {
        const ei = typeof initialStock === 'number' ? initialStock : 0;
        const c = typeof purchases === 'number' ? purchases : 0;
        const ef = typeof finalStock === 'number' ? finalStock : 0;
        return ei + c - ef;
    }, [initialStock, purchases, finalStock]);

    const handleReset = () => {
        setInitialStock(0);
        setPurchases(0);
        setFinalStock(0);
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-dark-gray">Cálculo de Custo da Mercadoria Vendida (CMV)</h3>
                        <p className="text-sm text-gray-500 mt-1">Insira os valores para calcular o CMV do período.</p>
                    </div>
                     <button onClick={handleReset} className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark-gray">
                        <ArrowPathIcon className="w-4 h-4" />
                        Limpar
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <InputField label="Estoque Inicial (EI)" value={initialStock} setValue={setInitialStock} description="Valor do estoque no início do período." />
                        <InputField label="Compras no Período (C)" value={purchases} setValue={setPurchases} description="Valor total das compras de mercadorias." />
                        <InputField label="Estoque Final (EF)" value={finalStock} setValue={setFinalStock} description="Valor do estoque no final do período." />
                    </div>
                    <div className="bg-light-gray p-8 rounded-lg text-center">
                        <p className="text-sm font-semibold text-gray-600">CMV (EI + C - EF)</p>
                        <p className="text-4xl font-bold text-primary-green my-2">{formatCurrency(cmv)}</p>
                        <p className="text-xs text-gray-500">Este é o custo total das mercadorias que sua empresa vendeu durante o período.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InputField: React.FC<{ label: string; value: string | number; setValue: (val: string | number) => void; description: string; }> = ({ label, value, setValue, description }) => (
    <div>
        <label className="block text-sm font-medium text-dark-gray">{label}</label>
        <div className="mt-1 relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">R$</span>
            </div>
            <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="block w-full rounded-md border-gray-300 pl-10 pr-4 py-2 focus:border-primary-green focus:ring-primary-green sm:text-sm"
            />
        </div>
         <p className="mt-1 text-xs text-gray-500">{description}</p>
    </div>
);