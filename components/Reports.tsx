
import React, { useState } from 'react';
import { IRPFSimulator } from './IRPFSimulator';
import { ChartBarIcon, DocumentTextIcon } from './icons/Icons';
import { DREReport } from './DREReport';
import { CMVReport } from './CMVReport';

type ReportTab = 'dre' | 'cmv' | 'irpf';

export const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>('dre');

  const tabs = [
    { id: 'dre', name: 'DRE', icon: <DocumentTextIcon className="w-5 h-5 mr-2"/> },
    { id: 'cmv', name: 'CMV', icon: <DocumentTextIcon className="w-5 h-5 mr-2"/> },
    { id: 'irpf', name: 'Simulador IRPF', icon: <ChartBarIcon className="w-5 h-5 mr-2"/> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'irpf':
        return <IRPFSimulator />;
      case 'dre':
        return <DREReport />;
      case 'cmv':
        return <CMVReport />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-dark-gray">Relatórios</h2>
      </div>
      
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ReportTab)}
              className={`${
                activeTab === tab.id
                  ? 'border-primary-green text-primary-green'
                  : 'border-transparent text-gray-500 hover:text-dark-gray hover:border-gray-300'
              } flex items-center whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 focus:outline-none`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div>
        {renderContent()}
      </div>
    </div>
  );
};
