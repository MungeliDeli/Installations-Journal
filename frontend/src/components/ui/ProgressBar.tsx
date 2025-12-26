import { useEffect, useState } from 'react';

interface ProgressBarProps {
  current: number;
  target: number;
  color?: 'red' | 'green' | 'blue' | 'orange';
  showPercentage?: boolean;
  animated?: boolean;
}

export default function ProgressBar({ 
  current, 
  target, 
  color = 'red', 
  showPercentage = true,
  animated = true 
}: ProgressBarProps) {
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const percentage = Math.min((current / target) * 100, 100);
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedWidth(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedWidth(percentage);
    }
  }, [percentage, animated]);

  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'bg-green-500';
      case 'blue':
        return 'bg-blue-500';
      case 'orange':
        return 'bg-orange-500';
      default:
        return 'bg-(--color-accent-red)';
    }
  };

  const getGlowColor = () => {
    switch (color) {
      case 'green':
        return 'shadow-[0_0_8px_rgba(34,197,94,0.4)]';
      case 'blue':
        return 'shadow-[0_0_8px_rgba(59,130,246,0.4)]';
      case 'orange':
        return 'shadow-[0_0_8px_rgba(249,115,22,0.4)]';
      default:
        return 'shadow-[0_0_8px_rgba(220,38,38,0.4)]';
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-(--color-text-secondary)">
          {current} / {target}
        </span>
        {showPercentage && (
          <span className="text-xs text-(--color-text-secondary)">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <div className="w-full bg-(--color-surface-secondary) rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${getColorClasses()} ${getGlowColor()} transition-all duration-1000 ease-out rounded-full`}
          style={{ width: `${animatedWidth}%` }}
        />
      </div>
    </div>
  );
}