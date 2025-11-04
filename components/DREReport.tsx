
import React from 'react';

const formatCurrency = (value: number) => {
    const formatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    return value < 0 ? `(${formatted.replace('-', '')})` : formatted;
};

const dreData = {
    grossRevenue: 150000,
    deductions: 12000,
    cmv: 65000,
    operatingExpenses: 25000,
    financialResult: -1500,
    taxEstimate: 12000
};

const DRELine: React.FC<{ label: string; value: number; isTotal?: boolean; isSub?: boolean; isNegative?: boolean; isFinal?: boolean }> = 
({ label, value, isTotal, isSub, isNegative, isFinal }) => (
    <div className={`flex justify-between py-2 border-b border-gray-100 ${isSub ? 'pl-4' : ''} ${isTotal ? 'font-semibold' : ''} ${isFinal ? 'font-bold text-lg' : 'text-sm'}`}>
        <p className={`${isNegative ? 'text-red-600' : 'text-dark-gray'}`}>{label}</p>
        <p className={`${isNegative ? 'text-red-600' : 'text-dark-gray'} ${isFinal ? 'text-primary-green' : ''}`}>{formatCurrency(value)}</p>
    </div>
);

export const DREReport: React.FC = () => {
    const netRevenue = dreData.grossRevenue - dreData.deductions;
    const grossProfit = netRevenue - dreData.cmv;
    const operatingResult = grossProfit - dreData.operatingExpenses;
    const resultBeforeTax = operatingResult + dreData.financialResult;
    const netProfit = resultBeforeTax - dreData.taxEstimate;

    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-dark-gray">Demonstração do Resultado (DRE)</h3>
                        <p className="text-sm text-gray-500">Período: Último Trimestre</p>
                    </div>
                    <button className="px-4 py-2 text-sm bg-primary-green text-white rounded-lg hover:bg-green-800">Exportar</button>
                </div>

                <div className="space-y-1">
                    <DRELine label="Receita Bruta de Vendas" value={dreData.grossRevenue} />
                    <DRELine label="(-) Deduções da Receita Bruta" value={dreData.deductions} isSub isNegative />
                    <DRELine label="= Receita Operacional Líquida" value={netRevenue} isTotal />

                    <DRELine label="(-) Custo das Mercadorias Vendidas (CMV)" value={dreData.cmv} isNegative />
                    <DRELine label="= Lucro Bruto" value={grossProfit} isTotal />

                    <DRELine label="(-) Despesas Operacionais" value={dreData.operatingExpenses} isNegative />
                    <DRELine label="= Resultado Operacional" value={operatingResult} isTotal />
                    
                    <DRELine label="(+/-) Resultado Financeiro" value={dreData.financialResult} isNegative={dreData.financialResult < 0} />
                    <DRELine label="= Resultado Antes do Imposto de Renda" value={resultBeforeTax} isTotal />

                    <DRELine label="(-) Estimativa de Impostos (IR)" value={dreData.taxEstimate} isNegative />
                    <DRELine label="= Lucro Líquido do Exercício" value={netProfit} isFinal />
                </div>
            </div>
        </div>
    );
};
