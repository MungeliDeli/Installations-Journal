import { useDashboard } from '../../hooks/useDashboard';
import { useAuth } from '../../contexts/AuthContext';

export default function QuickStats() {
  const { data: dashboardData, isLoading } = useDashboard();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="bg-(--color-surface) rounded-lg p-6 shadow-[0_0_10px_rgba(220,38,38,0.2)] animate-pulse">
        <div className="h-6 bg-(--color-surface-secondary) rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-(--color-surface-secondary) rounded w-1/2"></div>
              <div className="h-4 bg-(--color-surface-secondary) rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats;
  if (!stats) return null;

  const dailyAverage = stats.thisWeek > 0 ? (stats.thisWeek / 7).toFixed(1) : '0.0';
  const monthlyProgress = user?.monthlyTarget ? ((stats.thisMonth / user.monthlyTarget) * 100).toFixed(1) : '0';
  const weeklyProgress = user?.weeklyTarget ? ((stats.thisWeek / user.weeklyTarget) * 100).toFixed(1) : '0';

  const quickStats = [
    {
      label: "Daily Average (This Week)",
      value: dailyAverage,
      unit: "installs/day",
      color: "text-blue-400"
    },
    {
      label: "Weekly Progress",
      value: weeklyProgress,
      unit: "%",
      color: parseFloat(weeklyProgress) >= 100 ? "text-green-400" : parseFloat(weeklyProgress) >= 75 ? "text-orange-400" : "text-red-400"
    },
    {
      label: "Monthly Progress",
      value: monthlyProgress,
      unit: "%",
      color: parseFloat(monthlyProgress) >= 100 ? "text-green-400" : parseFloat(monthlyProgress) >= 75 ? "text-orange-400" : "text-red-400"
    },
    {
      label: "System Status",
      value: "ONLINE",
      unit: "",
      color: "text-green-400"
    }
  ];

  return (
    <div className="bg-(--color-surface) rounded-lg p-6 shadow-[0_0_10px_rgba(220,38,38,0.2)] hover:shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all duration-300 border border-(--color-border)">
      <div className="flex items-center mb-4">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-(--color-accent-red) mr-2"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <h3 className="text-lg font-bold text-(--color-text-primary)">
          QUICK STATS
        </h3>
      </div>
      
      <div className="space-y-4">
        {quickStats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between group">
            <span className="text-sm text-(--color-text-secondary) group-hover:text-(--color-text-primary) transition-colors duration-200">
              {stat.label}
            </span>
            <div className="flex items-baseline space-x-1">
              <span className={`font-bold ${stat.color}`}>
                {stat.value}
              </span>
              {stat.unit && (
                <span className="text-xs text-(--color-text-secondary)">
                  {stat.unit}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Pulse animation for online status */}
      <div className="flex items-center mt-4 pt-4 border-t border-(--color-border)">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-(--color-text-secondary)">
            Real-time monitoring active
          </span>
        </div>
      </div>
    </div>
  );
}