
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

// Based on the annual IRPF 2024 table
const taxBrackets = [
    { limit: 28559.70, rate: 0, deduction: 0 },
    { limit: 33919.80, rate: 0.075, deduction: 2141.98 },
    { limit: 45012.60, rate: 0.15, deduction: 4685.96 },
    { limit: 55976.16, rate: 0.225, deduction: 8066.91 },
    { limit: Infinity, rate: 0.275, deduction: 10865.72 },
];

const calculateIRPF = (annualIncome: number, deductibleExpenses: number) => {
    if (annualIncome <= 0) {
        return { base: 0, taxDue: 0, effectiveRate: 0, bracketRate: 0, deduction: 0 };
    }
    const base = Math.max(0, annualIncome - deductibleExpenses);
    
    const bracket = taxBrackets.find(b => base <= b.limit);
    if (!bracket) return { base, taxDue: 0, effectiveRate: 0, bracketRate: 0, deduction: 0 }; // Should not happen

    const taxDue = base * bracket.rate - bracket.deduction;
    const effectiveRate = (taxDue / annualIncome) * 100;

    return {
        base,
        taxDue: Math.max(0, taxDue),
        effectiveRate: isNaN(effectiveRate) ? 0 : effectiveRate,
        bracketRate: bracket.rate * 100,
        deduction: bracket.deduction,
    };
};

export const IRPFSimulator: React.FC = () => {
    const [annualIncome, setAnnualIncome] = useState<number | string>('');
    const [deductibleExpenses, setDeductibleExpenses] = useState<number | string>('');

    const results = useMemo(() => {
        const income = typeof annualIncome === 'number' ? annualIncome : 0;
        const expenses = typeof deductibleExpenses === 'number' ? deductibleExpenses : 0;
        return calculateIRPF(income, expenses);
    }, [annualIncome, deductibleExpenses]);

    const chartData = [
        { name: 'Renda Líquida', value: Math.max(0, (typeof annualIncome === 'number' ? annualIncome : 0) - results.taxDue), color: '#007A5E' },
        { name: 'Imposto Devido', value: results.taxDue, color: '#FFC857' },
    ];

    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md">
            <div className="max-w-4xl mx-auto">
                <h3 className="text-xl font-bold text-dark-gray">Simulador de Imposto de Renda (IRPF)</h3>
                <p className="text-sm text-gray-500 mt-1">Estime o valor do seu imposto anual com base na tabela progressiva.</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    {/* Input Section */}
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="annual-income" className="block text-sm font-medium text-dark-gray">Rendimentos Tributáveis Anuais</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-gray-500 sm:text-sm">R$</span>
                                </div>
                                <input
                                    type="number"
                                    id="annual-income"
                                    value={annualIncome}
                                    onChange={(e) => setAnnualIncome(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                    className="block w-full rounded-md border-gray-300 pl-10 pr-4 py-2 focus:border-primary-green focus:ring-primary-green sm:text-sm"
                                    placeholder="60000.00"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="deductible-expenses" className="block text-sm font-medium text-dark-gray">Total de Despesas Dedutíveis</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-gray-500 sm:text-sm">R$</span>
                                </div>
                                <input
                                    type="number"
                                    id="deductible-expenses"
                                    value={deductibleExpenses}
                                    onChange={(e) => setDeductibleExpenses(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                    className="block w-full rounded-md border-gray-300 pl-10 pr-4 py-2 focus:border-primary-green focus:ring-primary-green sm:text-sm"
                                    placeholder="5000.00"
                                />
                            </div>
                        </div>
                         <div className="!mt-4 text-xs text-gray-400 p-3 bg-light-gray rounded-lg">
                            <strong>Aviso Legal:</strong> Este simulador oferece apenas uma estimativa. Os cálculos não substituem a consulta a um contador profissional nem a declaração oficial. As alíquotas e tabelas podem sofrer alterações.
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="bg-light-gray p-6 rounded-lg">
                        <h4 className="font-bold text-dark-gray">Resultado da Simulação</h4>
                        <div className="mt-4 space-y-3 text-sm">
                            <ResultRow label="Base de Cálculo" value={formatCurrency(results.base)} />
                            <ResultRow label="Alíquota" value={`${results.bracketRate.toFixed(1)}%`} />
                            <ResultRow label="Parcela a Deduzir" value={formatCurrency(results.deduction)} />
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <ResultRow label="Imposto Devido" value={formatCurrency(results.taxDue)} isTotal />
                            <ResultRow label="Alíquota Efetiva" value={`${results.effectiveRate.toFixed(2)}%`} />
                        </div>

                        <div style={{ width: '100%', height: 150 }} className="mt-4">
                            <ResponsiveContainer>
                                <BarChart layout="vertical" data={chartData} stackOffset="expand">
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" hide />
                                    <Tooltip formatter={(value, name, props) => [`${(props.payload.value * 100 / (typeof annualIncome === 'number' ? annualIncome : 1)).toFixed(2)}%`, name]} />
                                    <Bar dataKey="value" stackId="a" isAnimationActive={false}>
                                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ResultRow: React.FC<{ label: string; value: string; isTotal?: boolean }> = ({ label, value, isTotal }) => (
    <div className={`flex justify-between items-center ${isTotal ? 'text-lg font-bold text-primary-green' : ''}`}>
        <p className={isTotal ? '' : 'text-gray-600'}>{label}</p>
        <p>{value}</p>
    </div>
);
