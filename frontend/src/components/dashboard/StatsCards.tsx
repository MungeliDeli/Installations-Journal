import { useEffect, useState } from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { useAuth } from '../../contexts/AuthContext';
import ProgressBar from '../ui/ProgressBar';

export default function StatsCards() {
  const { data: dashboardData, isLoading, error } = useDashboard();
  const { user } = useAuth();
  const [animatedValues, setAnimatedValues] = useState({
    allTime: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  });

  // Animate the numbers
  useEffect(() => {
    if (dashboardData?.stats) {
      const duration = 1500;
      const steps = 60;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        setAnimatedValues({
          allTime: Math.floor(dashboardData.stats.allTime * easeOut),
          today: Math.floor(dashboardData.stats.today * easeOut),
          thisWeek: Math.floor(dashboardData.stats.thisWeek * easeOut),
          thisMonth: Math.floor(dashboardData.stats.thisMonth * easeOut)
        });
        
        if (currentStep >= steps) {
          clearInterval(timer);
          setAnimatedValues({
            allTime: dashboardData.stats.allTime,
            today: dashboardData.stats.today,
            thisWeek: dashboardData.stats.thisWeek,
            thisMonth: dashboardData.stats.thisMonth
          });
        }
      }, stepDuration);
      
      return () => clearInterval(timer);
    }
  }, [dashboardData]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-(--color-surface) border-l-4 border-(--color-accent-red) rounded p-4 relative  animate-pulse"
          >
            <div className="h-4 bg-(--color-surface-secondary) rounded mb-3"></div>
            <div className="h-8 bg-(--color-surface-secondary) rounded mb-2"></div>
            <div className="h-3 bg-(--color-surface-secondary) rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-(--color-text-secondary) py-8">
        Failed to load dashboard data
      </div>
    );
  }

  const stats = dashboardData?.stats;
  if (!stats) return null;

  const cards = [
    {
      title: "TOTAL INSTALLS (ALL-TIME)",
      value: animatedValues.allTime.toLocaleString(),
      valueColor: "text-(--color-text-primary)",
      subtitle: "Lifetime installations",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      title: "INSTALLS TODAY",
      value: animatedValues.today.toLocaleString(),
      valueColor: "text-(--color-accent-red)",
      target: user?.dailyTarget || 4,
      current: stats.today,
      progressColor: 'red' as const,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      title: "INSTALLS THIS WEEK",
      value: animatedValues.thisWeek.toLocaleString(),
      valueColor: "text-blue-400",
      target: user?.weeklyTarget || 20,
      current: stats.thisWeek,
      progressColor: 'blue' as const,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      title: "INSTALLS THIS MONTH",
      value: animatedValues.thisMonth.toLocaleString(),
      valueColor: "text-green-400",
      target: user?.monthlyTarget || 80,
      current: stats.thisMonth,
      progressColor: 'green' as const,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-(--color-surface) border-l-4 border-(--color-accent-red) rounded p-4 relative  transition-all duration-300 group"
        >
          <div className="absolute top-4 right-4 text-(--color-text-muted) group-hover:text-(--color-accent-red) transition-colors duration-300">
            {card.icon}
          </div>
          <h3 className="text-xs text-(--color-text-secondary) uppercase tracking-wide mb-3 font-semibold">
            {card.title}
          </h3>
          <p className={`text-2xl font-bold mb-2 ${card.valueColor}`}>
            {card.value}
          </p>
          
          {card.target && card.current !== undefined ? (
            <div className="mt-3">
              <ProgressBar
                current={card.current}
                target={card.target}
                color={card.progressColor}
                animated={true}
              />
            </div>
          ) : (
            card.subtitle && (
              <p className="text-xs text-(--color-text-secondary)">{card.subtitle}</p>
            )
          )}
        </div>
      ))}
    </div>
  );
}

