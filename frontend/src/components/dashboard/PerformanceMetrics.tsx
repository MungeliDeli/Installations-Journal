import { useDashboard } from '../../hooks/useDashboard';

export default function PerformanceMetrics() {
  const { data: dashboardData, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(2)].map((_, index) => (
          <div
            key={index}
            className="bg-(--color-surface) rounded-lg p-6 shadow-[0_0_10px_rgba(220,38,38,0.2)] animate-pulse"
          >
            <div className="h-6 bg-(--color-surface-secondary) rounded mb-4"></div>
            <div className="h-12 bg-(--color-surface-secondary) rounded mb-2"></div>
            <div className="h-4 bg-(--color-surface-secondary) rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const stats = dashboardData?.stats;
  if (!stats) return null;

  const metrics = [
    {
      title: "AVERAGE RSRP",
      value: stats.averages.rsrp.toFixed(1),
      unit: "dBm",
      description: "Signal strength quality",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 20h20" />
          <path d="M5 20v-4" />
          <path d="M9 20v-8" />
          <path d="M13 20V8" />
          <path d="M17 20V4" />
        </svg>
      ),
      color: "text-blue-400",
      bgGlow: "shadow-[0_0_15px_rgba(59,130,246,0.2)]",
      getQuality: (value: number) => {
        if (value >= -70) return { text: "Excellent", color: "text-green-400" };
        if (value >= -85) return { text: "Good", color: "text-blue-400" };
        if (value >= -100) return { text: "Fair", color: "text-orange-400" };
        return { text: "Poor", color: "text-red-400" };
      }
    },
    {
      title: "AVERAGE SPEED",
      value: stats.averages.speed.toFixed(1),
      unit: "Mbps",
      description: "Network performance",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      color: "text-green-400",
      bgGlow: "shadow-[0_0_15px_rgba(34,197,94,0.2)]",
      getQuality: (value: number) => {
        if (value >= 100) return { text: "Excellent", color: "text-green-400" };
        if (value >= 50) return { text: "Good", color: "text-blue-400" };
        if (value >= 25) return { text: "Fair", color: "text-orange-400" };
        return { text: "Poor", color: "text-red-400" };
      }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {metrics.map((metric, index) => {
        const quality = metric.getQuality(parseFloat(metric.value));
        
        return (
          <div
            key={index}
            className={`bg-(--color-surface) rounded-lg p-6 ${metric.bgGlow} hover:shadow-[0_0_25px_rgba(220,38,38,0.3)] transition-all duration-300 group border border-(--color-border)`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-(--color-text-secondary) uppercase tracking-wide">
                {metric.title}
              </h3>
              <div className={`${metric.color} group-hover:scale-110 transition-transform duration-300`}>
                {metric.icon}
              </div>
            </div>
            
            <div className="flex items-baseline space-x-2 mb-2">
              <span className={`text-3xl font-bold ${metric.color}`}>
                {metric.value}
              </span>
              <span className="text-lg text-(--color-text-secondary)">
                {metric.unit}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-(--color-text-secondary)">
                {metric.description}
              </span>
              <span className={`text-xs font-medium ${quality.color}`}>
                {quality.text}
              </span>
            </div>
            
            {/* Animated background effect */}
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white to-transparent"></div>
          </div>
        );
      })}
    </div>
  );
}