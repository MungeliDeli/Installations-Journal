export default function DailyTargetModule() {
  const current = 3;
  const target = 5;
  const percentage = Math.round((current / target) * 100);

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
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
        <h2 className="text-lg font-semibold text-(--color-text-primary) uppercase tracking-wide">
          DAILY TARGET MODULE
        </h2>
      </div>

      <div className="mb-4">
        <p className="text-sm text-(--color-text-primary) mb-2">
          CURRENT: {current} / {target}
        </p>
        <div className="relative h-8 bg-(--color-background) rounded border border-(--color-border) overflow-hidden">
          <div
            className="h-full bg-(--color-accent-red) transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-(--color-success) z-10"
            style={{ left: `${target * 20}%` }}
          />
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-4">
        <p className="text-3xl font-bold text-(--color-accent-red)">{percentage}%</p>
      </div>

      <p className="text-sm text-(--color-text-secondary) mb-4">
        Status: On Track (Target: {target})
      </p>

      <button className="w-full bg-(--color-accent-red) text-(--color-text-primary) px-4 py-3 rounded font-semibold text-sm uppercase tracking-wide shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-shadow">
        VIEW TARGET SETTINGS
      </button>
    </div>
  );
}

