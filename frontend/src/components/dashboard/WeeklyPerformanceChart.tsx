export default function WeeklyPerformanceChart() {
  return (
    <div className="bg-(--color-surface) rounded p-6 border border-(--color-border) shadow-[0_0_10px_rgba(220,38,38,0.2)]">
      <div className="flex items-center gap-2 mb-4">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-(--color-text-primary)"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <h2 className="text-lg font-semibold text-(--color-text-primary) uppercase tracking-wide">
          WEEKLY PERFORMANCE CHART
        </h2>
      </div>

      <div className="bg-(--color-background) rounded border border-(--color-border) p-8 min-h-[300px] flex items-center justify-center">
        <p className="text-(--color-text-muted) text-sm">
          [DATA VISUALIZATION: LINE CHART PLACEHOLDER]
        </p>
      </div>

      <p className="text-xs text-(--color-text-muted) mt-4 text-center">
        Data refresh rate: 1 minute (Simulated)
      </p>
    </div>
  );
}

