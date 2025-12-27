import { useEffect, useState } from 'react';
import { type ChartDataPoint } from '../../services/dashboardApi';

interface AnimatedBarChartProps {
  data: ChartDataPoint[];
  color: 'red' | 'green' | 'blue' | 'orange' | 'purple';
  height?: number;
}

export default function AnimatedBarChart({ data, color, height = 200 }: AnimatedBarChartProps) {
  const [animatedData, setAnimatedData] = useState<number[]>([]);
  const maxValue = Math.max(...data.map(d => d.count), 1);

  useEffect(() => {
    // Reset animation
    setAnimatedData(new Array(data.length).fill(0));
    
    // Start animation after a short delay
    const timer = setTimeout(() => {
      setAnimatedData(data.map(d => d.count));
    }, 200);

    return () => clearTimeout(timer);
  }, [data]);

  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-gradient-to-t from-green-500 to-green-400',
          glow: 'shadow-[0_0_15px_rgba(34,197,94,0.3)]',
          border: 'border-green-400'
        };
      case 'blue':
        return {
          bg: 'bg-gradient-to-t from-blue-500 to-blue-400',
          glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]',
          border: 'border-blue-400'
        };
      case 'orange':
        return {
          bg: 'bg-gradient-to-t from-orange-500 to-orange-400',
          glow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]',
          border: 'border-orange-400'
        };
      case 'purple':
        return {
          bg: 'bg-gradient-to-t from-purple-500 to-purple-400',
          glow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]',
          border: 'border-purple-400'
        };
      default:
        return {
          bg: 'bg-gradient-to-t from-(--color-accent-red) to-red-400',
          glow: 'shadow-[0_0_15px_rgba(220,38,38,0.3)]',
          border: 'border-red-400'
        };
    }
  };

  const colorClasses = getColorClasses();

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-(--color-text-secondary)">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex items-end justify-between h-full gap-2 px-2">
        {data.map((item, index) => {
          const barHeight = maxValue > 0 ? (animatedData[index] / maxValue) * (height - 40) : 0;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1 group">
              {/* Value label */}
              <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="text-xs text-(--color-text-primary) bg-(--color-surface) px-2 py-1 rounded shadow-lg border border-(--color-border)">
                  {animatedData[index]}
                </span>
              </div>
              
              {/* Bar */}
              <div className="flex items-end w-full justify-center" style={{ height: height - 40 }}>
                <div
                  className={`w-full max-w-[40px] ${colorClasses.bg} ${colorClasses.glow} ${colorClasses.border} border-t-2 rounded-t-lg transition-all duration-1000 ease-out hover:scale-105 cursor-pointer`}
                  style={{ height: `${barHeight}px` }}
                />
              </div>
              
              {/* Label */}
              <div className="mt-2 text-center">
                <span className="text-xs text-(--color-text-secondary) font-medium">
                  {item.label || item.week || item.month || item.date}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}