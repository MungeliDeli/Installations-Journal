import { useState, useEffect } from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import AnimatedBarChart from '../ui/AnimatedBarChart';

type ChartTab = 'daily' | 'weekly' | 'monthly';

export default function InteractiveChart() {
  const [activeTab, setActiveTab] = useState<ChartTab>('daily');
  const { data: dashboardData, isLoading } = useDashboard();

  // Debug effect to track tab changes
  useEffect(() => {
  }, [activeTab, dashboardData]);

  const tabs = [
    { id: 'daily' as ChartTab, label: 'Daily', color: 'red' as const, description: 'Last 5 days' },
    { id: 'weekly' as ChartTab, label: 'Weekly', color: 'blue' as const, description: 'Last 5 weeks' },
    { id: 'monthly' as ChartTab, label: 'Monthly', color: 'green' as const, description: 'Last 5 months' },
  ];

  const getActiveTabData = () => {
    if (!dashboardData?.chartData) {
      return [];
    }
    
    const data = dashboardData.chartData[activeTab] || [];
    
    return data;
  };

  const getActiveTabColor = () => {
    return tabs.find(tab => tab.id === activeTab)?.color || 'red';
  };

  const getTotalForPeriod = () => {
    const data = getActiveTabData();
    return data.reduce((sum, item) => sum + item.count, 0);
  };

  if (isLoading) {
    return (
      <div className="bg-(--color-surface) rounded-lg p-6 ">
        <div className="animate-pulse">
          <div className="h-6 bg-(--color-surface-secondary) rounded mb-4"></div>
          <div className="flex space-x-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-(--color-surface-secondary) rounded w-20"></div>
            ))}
          </div>
          <div className="h-64 bg-(--color-surface-secondary) rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-(--color-surface) rounded-lg p-6 ">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-(--color-text-primary) mb-1">
            INSTALLATION TRENDS - {activeTab.toUpperCase()}
          </h3>
          <p className="text-sm text-(--color-text-secondary)">
            {tabs.find(tab => tab.id === activeTab)?.description} • Total: {getTotalForPeriod()}
          </p>
        </div>
        <div className="flex items-center space-x-1 bg-(--color-surface-secondary) rounded-lg p-1 relative z-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveTab(tab.id);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer select-none ${
                activeTab === tab.id
                  ? 'bg-(--color-accent-red) text-white '
                  : 'text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-(--color-surface)  hover:outline hover:outline-2 hover:outline-(--color-accent-red) hover:outline-offset-1'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 relative">
        {getActiveTabData().length > 0 ? (
          <AnimatedBarChart
            key={activeTab} // Force re-render when tab changes
            data={getActiveTabData()}
            color={getActiveTabColor()}
            height={256}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-(--color-text-secondary)">
            <div className="text-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="mx-auto mb-2 opacity-50"
              >
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <p>No data available for this period</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}