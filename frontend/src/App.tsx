import { useState } from 'react';
import { RoutesTab } from './adapters/ui/components/RoutesTab';
import { CompareTab } from './adapters/ui/components/CompareTab';
import { BankingTab } from './adapters/ui/components/BankingTab';
import { PoolingTab } from './adapters/ui/components/PoolingTab';

type Tab = 'routes' | 'compare' | 'banking' | 'pooling';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('routes');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'routes', label: 'Routes' },
    { id: 'compare', label: 'Compare' },
    { id: 'banking', label: 'Banking' },
    { id: 'pooling', label: 'Pooling' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">FuelEU Maritime Compliance Dashboard</h1>
          <p className="text-blue-100 mt-1">Regulation (EU) 2023/1805 - Compliance Management</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {activeTab === 'routes' && <RoutesTab />}
          {activeTab === 'compare' && <CompareTab />}
          {activeTab === 'banking' && <BankingTab />}
          {activeTab === 'pooling' && <PoolingTab />}
        </div>
      </div>

      <footer className="bg-gray-800 text-gray-300 py-4 mt-12">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>FuelEU Maritime Compliance Platform | Hexagonal Architecture</p>
          <p className="text-gray-500 mt-1">Built with React + TypeScript + TailwindCSS by Niket kumar</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
