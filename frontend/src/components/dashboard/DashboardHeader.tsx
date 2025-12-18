import ThemeToggle from "./ThemeToggle";

export default function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-(--color-accent-red) uppercase tracking-wide">
        CONTROL PANEL
      </h1>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button className="bg-(--color-success) text-(--color-text-primary) px-6 py-3 rounded flex items-center gap-2 font-semibold text-sm uppercase tracking-wide shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] transition-shadow">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          NEW INSTALLATION ENTRY
        </button>
      </div>
    </div>
  );
}

